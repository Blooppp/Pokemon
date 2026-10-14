import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class GymsService {
  findById(arg0: number) {
    throw new Error('Method not implemented.');
  }
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createGym(gym_id: string, gym_name: string, city: string, gym_type: string, leader_name: string) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO gyms (gym_id, gym_name, city, gym_type, leader_name) VALUES (?, ?, ?, ?, ?)',
      [gym_id, gym_name, city, gym_type, leader_name],
    );
    return { id: result.insertId, gym_id, gym_name, city, gym_type, leader_name };
  }

  async findByGym(gym_name: string): Promise<any>;
  async findByGym(gym_id: number): Promise<any>;
  async findByGym(identifier: string | number): Promise<any> {
    const field = typeof identifier === 'number' ? 'gym_id' : 'gym_name';
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT gym_id, gym_name, city, gym_type, leader_name FROM gyms WHERE ${field} = ?`,
      [identifier],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT gym_id, gym_name, city, gym_type, leader_name FROM gyms',
    );
    return rows;
  }

  async updateGyms(
    gym_id: number,
    partial: { gym_name?: string; password?: string; leader_name?: string },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.gym_name) {
      fields.push('gym_name = ?');
      values.push(partial.gym_name);
    }

    if (partial.password) {
      const hashed = await bcrypt.hash(partial.password, 10);
      fields.push('password = ?');
      values.push(hashed);
    }

    if (partial.leader_name) {
      fields.push('leader_name = ?');
      values.push(partial.leader_name);
    }

    if (fields.length === 0) return await this.findByGym(gym_id);

    values.push(gym_id);

    const sql = `UPDATE gyms SET ${fields.join(', ')} WHERE gym_id = ?`;

    await this.pool().execute(sql, values);

    return this.findByGym(gym_id);
  }

  async deleteGyms(gym_id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM gyms WHERE gym_id = ?',
      [gym_id],
    );
    return res.affectedRows > 0;
  }

  async setRefreshToken(gym_id: number, refreshToken: string | null) {
    await this.pool().execute(
      'UPDATE gyms SET refresh_token = ? WHERE gym_id = ?',
      [refreshToken, gym_id],
    );
  }

  async findByRefreshToken(refreshToken: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT gym_id, gym_name, city, gym_type, leader_name FROM gyms WHERE refresh_token = ?',
      [refreshToken],
    );
    return rows[0];
  }
}