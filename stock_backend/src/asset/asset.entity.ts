import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  sku: string;

  @Column()
  condition: 'Fair' | 'Good' | 'Very Good';

  @Column({ type: 'int', name: 'qty_in' })
  qty_in: number;

  @Column({ type: 'int', name: 'qty_out', default: 0 })
  qty_out: number;

  @Column({ type: 'decimal', name: 'unit_price', precision: 10, scale: 2, default: 0.00 })
  unit_price: number;

  @Column({ type: 'int', default: 5 })
  threshold: number;

  // Computed properties for PostgreSQL compatibility
  get balance_qty(): number {
    return (this.qty_in ?? 0) - (this.qty_out ?? 0);
  }

  get total_price(): number {
    return this.balance_qty * Number(this.unit_price ?? 0);
  }
}
