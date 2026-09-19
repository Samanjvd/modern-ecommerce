import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import adminRoutes from './routes/admin/product.routes.js';
import adminCategoryRoutes from './routes/admin/category.routes.js';
import userRoutes from './routes/user.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRouter from './routes/order.route.js';
import adminOrderRoutes from './routes/admin/order.route.js';
import paymentRoutes from './routes/payment.route.js';
import reviewRouter from './routes/review.route.js';
import adminUserRouter from './routes/admin/user.route.js';
import dashboardRouter from './routes/admin/dashboard.route.js';

dotenv.config();

export const app = express();

app.use(helmet());

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/categories', adminCategoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRouter);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', reviewRouter);
app.use('/api/admin/users', adminUserRouter);
app.use('/api/admin/dashboard', dashboardRouter);
