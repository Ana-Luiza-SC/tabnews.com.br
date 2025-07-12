import { describe, it, expect } from 'vitest';
import { isPasswordMismatch } from '../../../models/passwordValidation.js';

describe('isPasswordMismatch', () => {

  it('retorna false se a confirmação e a nova forem nulas', () => {
    expect(isPasswordMismatch(null,null, null)).toBe(false);
  });

  it('retorna false se a nova senha for diferente da confirmação', () => {
    expect(isPasswordMismatch('abc','abc', 'abc1')).toBe(false);
  });

  it('retorna false se a nova senha for igual a antiga', () => {
    expect(isPasswordMismatch('abc1','abc1', 'abc1')).toBe(false);
  });

  it('retorna false se a nova senha for menor que 8 caracteres', () => {
    expect(isPasswordMismatch('abc','abc1', 'abc1')).toBe(false);
  });

});
