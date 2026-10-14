import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PokemonService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

 async createPokemon(
  pokemon_id: string,
  pokemon_name: string,
  type_id: number,
  trainer_id: number,
) {
  const [result] = await this.pool().execute<OkPacket>(
    `INSERT INTO pokemon
      (pokemon_id, pokemon_name, type_id, trainer_id)
     VALUES (?, ?, ?, ?)`,
    [pokemon_id, pokemon_name, type_id, trainer_id],
  );

  return {
    id: result.insertId,
    pokemon_id,
    pokemon_name,
    type_id,
    trainer_id,
  };
}

  async findByPokemon(pokemon_name: string): Promise<RowDataPacket | undefined>;
  async findByPokemon(id: number): Promise<RowDataPacket | undefined>;
  async findByPokemon(identifier: string | number): Promise<RowDataPacket | undefined> {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      typeof identifier === 'string'
        ? 'SELECT pokemon_id, pokemon_name FROM pokemon WHERE pokemon_name = ?'
        : 'SELECT pokemon_id, pokemon_name FROM pokemon WHERE pokemon_id = ?',
      [identifier],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT pokemon_id, pokemon_name FROM pokemon',
    );
    return rows;
  }

  async updatePokemon(
    pokemon_id: number,
    partial: {
      pokemon_name: any; username?: string; password?: string; role?: string 
},
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.pokemon_name) {
      fields.push('pokemon_name = ?');
      values.push(partial.pokemon_name);
    }

    if (partial.password) {
      const hashed = await bcrypt.hash(partial.password, 10);
      fields.push('password = ?');
      values.push(hashed);
    }

    if (partial.role) {
      fields.push('role = ?');
      values.push(partial.role);
    }

    if (fields.length === 0) return await this.findByPokemon(pokemon_id);

    values.push(pokemon_id);

    const sql = `UPDATE pokemon SET ${fields.join(', ')} WHERE pokemon_id = ?`;

    await this.pool().execute(sql, values);

    return this.findByPokemon(pokemon_id);
  }

  async deletePokemon(pokemon_id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM pokemon WHERE pokemon_id = ?',
      [pokemon_id],
    );
    return res.affectedRows > 0;
  }

  async setRefreshToken(pokemon_id: number, refreshToken: string | null) {
    await this.pool().execute(
      'UPDATE pokemon SET refresh_token = ? WHERE pokemon_id = ?',
      [refreshToken, pokemon_id],
    );
  }

  async findByRefreshToken(refreshToken: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT pokemon_id, pokemon_name FROM pokemon WHERE refresh_token = ?',
      [refreshToken],
    );
    return rows[0];
  }
}