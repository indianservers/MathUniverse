import { describe, expect, it } from 'vitest';
import { magnitudeExponent, scaleObjects, worldExamples } from './magnitudeModel';

describe('order-of-magnitude conventions',()=>{
 it('uses the logarithmic midpoint for the nearest power',()=>{
  expect(magnitudeExponent(3.1,5)).toBe(5);
  expect(magnitudeExponent(Math.sqrt(10),5)).toBe(6);
  expect(magnitudeExponent(3.2,5)).toBe(6);
  expect(magnitudeExponent(4.5,-3)).toBe(-2);
 });
 it('supports the distinct classroom coefficient rule shown in the mockup',()=>{
  expect(magnitudeExponent(3.2,5,'classroom')).toBe(5);
  expect(magnitudeExponent(4.9,-3,'classroom')).toBe(-3);
  expect(magnitudeExponent(5,-3,'classroom')).toBe(-2);
  expect(magnitudeExponent(7.8,8,'classroom')).toBe(9);
 });
 it('normalizes coefficients outside the first decade',()=>{
  expect(magnitudeExponent(0.01,0)).toBe(-2);
  expect(magnitudeExponent(1000,0)).toBe(3);
  expect(magnitudeExponent(0.78,9)).toBe(9);
 });
 it('rejects undefined orders and invalid exponents',()=>{
  for(const c of [0,-1,Infinity,NaN])expect(()=>magnitudeExponent(c,0)).toThrow();
  expect(()=>magnitudeExponent(1,1.5)).toThrow();
 });
 it('uses meters consistently for all example calculations',()=>{
  const moon=worldExamples.find(e=>e.name==='Distance to Moon')!;
  expect(moon.coefficient*10**moon.exponent).toBe(384400000);
  expect(magnitudeExponent(moon.coefficient,moon.exponent)).toBe(9);
  expect(magnitudeExponent(moon.coefficient,moon.exponent,'classroom')).toBe(8);
  expect(scaleObjects.find(o=>o.id==='ant')!.exponent).toBe(-2);
  expect(worldExamples.find(e=>e.name==='Size of a virus')!.exponent).toBe(-7);
 });
});
