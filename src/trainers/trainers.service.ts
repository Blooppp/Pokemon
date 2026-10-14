import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class TrainersService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createTrainer(trainer_id: string, trainer_name: string, region: string, badge_count: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO trainers (trainer_id, trainer_name, region, badge_count) VALUES (?, ?, ?, ?)',
      [trainer_id, trainer_name, region, badge_count],
    );
    return { id: result.insertId, trainer_id, trainer_name, region, badge_count };
  }

  async findByTrainer(trainer_name: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT trainer_id, trainer_name, region, badge_count FROM trainers WHERE trainer_name = ?',
      [trainer_name],
    );
    return rows[0];
  }

  async findByTrainerId(trainer_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT trainer_id, trainer_name, region, badge_count FROM trainers WHERE trainer_id = ?',
      [trainer_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT trainer_id, trainer_name, region, badge_count FROM trainers',
    );
    return rows;
  }

  async updateTrainer(
    id: number,
    partial: { trainer_name?: string; region?: string; badge_count?: number },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.trainer_name) {
      fields.push('trainer_name = ?');
      values.push(partial.trainer_name);
    }

    if (partial.region) {
      fields.push('region = ?');
      values.push(partial.region);
    }

    if (partial.badge_count !== undefined) {
      fields.push('badge_count = ?');
      values.push(partial.badge_count);
    }

    if (fields.length === 0) return await this.findByTrainerId(id);

    values.push(id);

    const sql = `UPDATE trainers SET ${fields.join(', ')} WHERE trainer_id = ?`;

    await this.pool().execute(sql, values);

    return this.findByTrainerId(id);
  }

  async deleteTrainer(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM trainers WHERE trainer_id = ?',
      [id],
    );
    return res.affectedRows > 0;
  }

  async setRefreshToken(id: number, refreshToken: string | null) {
    await this.pool().execute(
      'UPDATE trainers SET refresh_token = ? WHERE trainer_id = ?',
      [refreshToken, id],
    );
  }

  async findByRefreshToken(refreshToken: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT trainer_id, trainer_name, region, badge_count FROM trainers WHERE refresh_token = ?',
      [refreshToken],
    );
    return rows[0];
  }
}