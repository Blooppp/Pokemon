import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class BattlesService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createBattle(
    battle_id: number,
    battle_date: string,
    result: string,
    trainer_id: number,
    gym_id: number,
  ) {
    if (
      battle_id == null ||
      !battle_date ||
      !result ||
      trainer_id == null ||
      gym_id == null
    ) {
      throw new BadRequestException(
        'battle_id, battle_date, result, trainer_id and gym_id are required',
      );
    }

    try {
      await this.pool().execute<OkPacket>(
        `INSERT INTO battles (battle_id, battle_date, result, trainer_id, gym_id)
         VALUES (?, ?, ?, ?, ?)`,
        [battle_id, battle_date, result, trainer_id, gym_id],
      );
      return { battle_id, battle_date, result, trainer_id, gym_id };
    } catch (err: any) {
      this.handleDbError(err);
    }
  }

  async findByBattle(battle_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT battle_id, battle_date, result, trainer_id, gym_id
       FROM battles WHERE battle_id = ?`,
      [battle_id],
    );
    if (!rows[0]) throw new NotFoundException(`Battle ${battle_id} not found`);
    return rows[0];
  }

  // alias in case your controller still calls the old name
  async findByBattles(battle_id: number) {
    return this.findByBattle(battle_id);
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT battle_id, battle_date, result, trainer_id, gym_id FROM battles',
    );
    return rows;
  }

  async updateBattle(
    battle_id: number,
    partial: {
      battle_date?: string;
      result?: string;
      trainer_id?: number;
      gym_id?: number;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.battle_date !== undefined) {
      fields.push('battle_date = ?');
      values.push(partial.battle_date);
    }
    if (partial.result !== undefined) {
      fields.push('result = ?');
      values.push(partial.result);
    }
    if (partial.trainer_id !== undefined) {
      fields.push('trainer_id = ?');
      values.push(partial.trainer_id);
    }
    if (partial.gym_id !== undefined) {
      fields.push('gym_id = ?');
      values.push(partial.gym_id);
    }

    if (fields.length === 0) return this.findByBattle(battle_id);

    values.push(battle_id);

    try {
      const [res] = await this.pool().execute<OkPacket>(
        `UPDATE battles SET ${fields.join(', ')} WHERE battle_id = ?`,
        values,
      );
      if (res.affectedRows === 0) {
        throw new NotFoundException(`Battle ${battle_id} not found`);
      }
    } catch (err: any) {
      if (err instanceof NotFoundException) throw err;
      this.handleDbError(err);
    }

    return this.findByBattle(battle_id);
  }

  async deleteBattle(battle_id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM battles WHERE battle_id = ?',
      [battle_id],
    );
    if (res.affectedRows === 0) {
      throw new NotFoundException(`Battle ${battle_id} not found`);
    }
    return { deleted: true };
  }

  private handleDbError(err: any): never {
    if (err.code === 'ER_DUP_ENTRY') {
      throw new ConflictException('Battle already exists');
    }
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      throw new BadRequestException('trainer_id or gym_id does not exist');
    }
    if (
      err.code === 'ER_TRUNCATED_WRONG_VALUE' ||
      err.code === 'ER_WRONG_VALUE'
    ) {
      throw new BadRequestException(
        'Invalid value. Use battle_date in YYYY-MM-DD format',
      );
    }
    throw err;
  }
}