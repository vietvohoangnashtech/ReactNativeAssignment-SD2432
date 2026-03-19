import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from '../users/users.entity';
import { Product } from '../products/products.entity';
import { Order } from '../orders/orders.entity';
import * as bcrypt from 'bcrypt';
import path from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: path.join(__dirname, 'db.sqlite'),
      entities: [User, Product, Order],
      synchronize: true,
      migrationsRun: true,
    }),
  ],
})
export class SqliteModule {
  constructor(private dataSource: DataSource) {
    this.seedDatabase();
  }

  async seedDatabase() {
    await this.seedUsers();
    await this.seedProducts();
  }

  async seedUsers() {
    const userRepository = this.dataSource.getRepository(User);
    const count = await userRepository.count();
    if (count > 0) {
      return;
    }

    const password = await bcrypt.hash('123456', 10);

    await userRepository.save([
      {
        username: 'test',
        password,
        fullName: 'Test User',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        age: 28,
        role: 'user',
      },
      {
        username: 'demo',
        password,
        fullName: 'Demo User',
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@example.com',
        age: 30,
        role: 'user',
      },
      {
        username: 'admin',
        password,
        fullName: 'Admin User',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        age: 35,
        role: 'admin',
      },
    ]);
    console.log('Users seeded successfully.');
  }

  async seedProducts() {
    const productRepository = this.dataSource.getRepository(Product);
    const count = await productRepository.count();
    if (count > 0) {
      return;
    }
    await productRepository.save([
      {
        name: 'Sonic-X Wireless Headphones',
        description:
          'Premium over-ear wireless headphones with active noise cancellation, 30-hour battery life, and immersive 3D audio. Perfect for music lovers and professionals.',
        price: 129.0,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        category: 'Electronics',
        isOnSale: false,
      },
      {
        name: 'Metro Classic Timepiece',
        description:
          'A timeless stainless steel watch with sapphire crystal glass, automatic movement, and a 42mm case. Elevate your style with every glance.',
        price: 85.5,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        category: 'Fashion',
        isOnSale: false,
      },
      {
        name: 'Artisan Ceramic Mug',
        description:
          'Handcrafted ceramic coffee mug with a minimalist design. Dishwasher-safe, 12oz capacity, and available in matte earth tones. Start your day right.',
        price: 24.0,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400',
        category: 'Home',
        isOnSale: false,
      },
      {
        name: 'Glow Essentials Kit',
        description:
          'A curated skincare set featuring vitamin C serum, hyaluronic acid moisturizer, and SPF 50 sunscreen. Achieve glowing, healthy skin in 30 days.',
        price: 45.0,
        originalPrice: 60.0,
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
        category: 'Beauty',
        isOnSale: true,
      },
      {
        name: 'Quantum Pro Smartwatch',
        description:
          'Experience the future on your wrist. Combines sleek industrial design with cutting-edge health monitoring sensors. Features an Always-On OLED display that tracks heart rate, blood oxygen, and daily activity with medical-grade precision.',
        price: 299.0,
        originalPrice: 349.0,
        image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=400',
        category: 'Electronics',
        isOnSale: true,
      },
      {
        name: 'Sport Running Shoes',
        description:
          'Lightweight, breathable running shoes with responsive foam cushioning and anti-slip rubber outsole. Ideal for daily running and gym sessions.',
        price: 89.99,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        category: 'Fashion',
        isOnSale: false,
      },
    ]);
    console.log('Products seeded successfully.');
  }
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      // database: 'db.sqlite', // Path to your SQLite database - it will be created in the root folder of your project
      database: path.join(__dirname, 'db.sqlite'), // Use path.join to create absolute path
      entities: [User, Product],
      synchronize: true, // Use with caution in production,

      migrationsRun: true,
    }),
  ],
})
export class SqliteModule {
  constructor(private dataSource: DataSource) {
    this.seedDatabase();
  }

  async seedDatabase() {
    await this.seedUsers();
    await this.seedProducts();
  }

  async seedUsers() {
    const userRepository = this.dataSource.getRepository(User);
    const count = await userRepository.count();
    if (count > 0) {
      return;
    }

    const password = await bcrypt.hash('123456', 10);

    await userRepository.save([
      {
        username: 'test',
        password: password,
        fullName: 'Test User',
        email: 'test@example.com',
      },
      {
        username: 'demo',
        password: password,
        fullName: 'Demo User',
        email: 'demo@example.com',
      },
    ]);
    console.log('Users seeded successfully.');
  }

  async seedProducts() {
    const productRepository = this.dataSource.getRepository(Product);
    const count = await productRepository.count();
    if (count > 0) {
      return;
    }
    await productRepository.save([
      {
        name: 'Laptop',
        description: 'High-performance laptop',
        price: 1200.0,
      },
      {
        name: 'Smartphone',
        description: 'Latest model smartphone',
        price: 800.0,
      },
      {
        name: 'Headphones',
        description: 'Noise-cancelling headphones',
        price: 150.0,
      },
    ]);
    console.log('Products seeded successfully.');
  }
}
