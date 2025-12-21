import { describe, expect, test } from 'vitest';
import { Order, OrderSide } from '@pp-clca-pcm/domain/entities/order';
import { Stock } from '@pp-clca-pcm/domain/entities/stock';
import { User } from '@pp-clca-pcm/domain/entities/user';

describe('Order Entity', () => {
  const userResult = User.create('John', 'Doe', 'john.doe@example.com', 'Password123!');
  let user: User;

  if (userResult instanceof User) {
    user = userResult;
  } else {
    throw new Error(`Failed to create user for tests: ${userResult.message}`);
  }
  const stock = Stock.create('AAPL', 'Apple Inc.');

  test('should create an order successfully', () => {
    const order = Order.create(stock, user, OrderSide.BUY, 150.00, 10);

    expect(order).toBeInstanceOf(Order);
    expect(order.identifier).toBeDefined();
    expect(order.stock).toEqual(stock);
    expect(order.owner).toEqual(user);
    expect(order.side).toBe(OrderSide.BUY);
    expect(order.price).toBe(150.00);
    expect(order.quantity).toBe(10);
    expect(order.remainingQuantity).toBe(10);
    expect(order.createdAt).toBeInstanceOf(Date);
    expect(order.executed).toBe(false);
  });

  test('should reduce remaining quantity correctly', () => {
    const initialOrder = Order.create(stock, user, OrderSide.BUY, 150.00, 10);
    const updatedOrder = initialOrder.reduceRemainingBy(5);

    expect(updatedOrder.remainingQuantity).toBe(5);
    expect(updatedOrder.executed).toBe(false);

    const fullyExecutedOrder = updatedOrder.reduceRemainingBy(5);
    expect(fullyExecutedOrder.remainingQuantity).toBe(0);
    expect(fullyExecutedOrder.executed).toBe(true);
  });

  test('should not reduce remaining quantity below zero', () => {
    const initialOrder = Order.create(stock, user, OrderSide.BUY, 150.00, 10);
    const updatedOrder = initialOrder.reduceRemainingBy(15);

    expect(updatedOrder.remainingQuantity).toBe(0);
    expect(updatedOrder.executed).toBe(true);
  });

  test('should update order properties correctly', () => {
    const initialOrder = Order.create(stock, user, OrderSide.BUY, 150.00, 10);
    const newStock = Stock.create('GOOG', 'Google Inc.');
    const updatedOrder = initialOrder.update({
      stock: newStock,
      side: OrderSide.SELL,
      price: 160.00,
      quantity: 20,
      remainingQuantity: 15,
    });

    expect(updatedOrder.stock).toEqual(newStock);
    expect(updatedOrder.side).toBe(OrderSide.SELL);
    expect(updatedOrder.price).toBe(160.00);
    expect(updatedOrder.quantity).toBe(20);
    expect(updatedOrder.remainingQuantity).toBe(15);
    expect(updatedOrder.identifier).toBe(initialOrder.identifier);
    expect(updatedOrder.createdAt).toBe(initialOrder.createdAt);
  });

  test('should handle invalid remaining quantity during update', () => {
    const initialOrder = Order.create(stock, user, OrderSide.BUY, 150.00, 10);
    const updatedOrderNegative = initialOrder.update({ remainingQuantity: -5 });
    expect(updatedOrderNegative.remainingQuantity).toBe(0);

    const updatedOrderExceeds = initialOrder.update({ remainingQuantity: 15 });
    expect(updatedOrderExceeds.remainingQuantity).toBe(10);
  });

  test('should return true for executed when remaining quantity is zero', () => {
    const order = Order.create(stock, user, OrderSide.BUY, 150.00, 10).reduceRemainingBy(10);
    expect(order.executed).toBe(true);
  });

  test('should return false for executed when remaining quantity is not zero', () => {
    const order = Order.create(stock, user, OrderSide.BUY, 150.00, 10).reduceRemainingBy(5);
    expect(order.executed).toBe(false);
  });
});
