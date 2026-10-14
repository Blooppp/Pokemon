import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class TypesService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

 async createType(type_id: number, type_name: string) {
  const [result] = await this.pool().execute<OkPacket>(
    'INSERT INTO types (type_name) VALUES (?)',
    [type_name],
  );

  return {
    type_id: result.insertId,
    type_name,
  };
}

  // NEW: insert many types at once, skipping any that already exist
  async createManyTypes(types: { type_id: string; type_name: string }[]) {
    if (types.length === 0) return { inserted: 0, skipped: 0 };

    const placeholders = types.map(() => '(?, ?)').join(', ');
    const values = types.flatMap((t) => [t.type_id, t.type_name]);

    const [result] = await this.pool().execute<OkPacket>(
      `INSERT IGNORE INTO types (type_id, type_name) VALUES ${placeholders}`,
      values,
    );

    return {
      inserted: result.affectedRows,
      skipped: types.length - result.affectedRows,
    };
  }

  async findByType_name(type_name: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT type_id, type_name FROM types WHERE type_name = ?',
      [type_name],
    );
    return rows[0];
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT type_id, type_name FROM types WHERE type_id = ?',
      [id], 
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT type_id, type_name FROM types',
    );
    return rows;
  }

  async updateType(
    id: number,
    partial: { type_name?: string; password?: string; role?: string },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.type_name) {
      fields.push('type_name = ?');
      values.push(partial.type_name);
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

    if (fields.length === 0) return await this.findById(id);

    values.push(id);

    const sql = `UPDATE types SET ${fields.join(', ')} WHERE type_id = ?`;

    await this.pool().execute(sql, values);

    return this.findById(id);
  }

  async deleteType(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM types WHERE type_id = ?',
      [id],
    );
    return res.affectedRows > 0;
  }

  async setRefreshToken(id: number, refreshToken: string | null) {
    await this.pool().execute(
      'UPDATE types SET refresh_token = ? WHERE id = ?',
      [refreshToken, id],
    );
  }

  async findByRefreshToken(refreshToken: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT id, type_name, description FROM types WHERE refresh_token = ?',
      [refreshToken],
    );
    return rows[0];
  }
}