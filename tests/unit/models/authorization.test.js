import authorization from '../../../models/authorization.js';
import { ValidationError } from '../../../errors';

// Mock de dependências externas
vi.mock('models/user-features', () => ({
  default: new Set([
    'create:session',
    'create:user',
    'update:user',
    'update:user:others',
    'ban:user',
    'read:activation_token',
    'create:content:text_root',
    'create:content:text_child',
    'update:content'
  ])
}));

vi.mock('models/validator.js', () => ({
  default: vi.fn().mockImplementation((obj) => obj)
}));

describe('filterInput MC/DC Tests', () => {
  const mockUser = (features = [], id = 'user123') => ({
    id,
    features,
    permissions: true
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // CT1: create:session com permissão
  it('CT1 - create_session_can_true', () => {
    const user = mockUser(['create:session']);
    const input = { email: 'test@tabnews.com', password: '123456' };
    
    const result = authorization.filterInput(user, 'create:session', input, null);
    
    expect(result).toEqual({
      email: 'test@tabnews.com',
      password: '123456'
    });
  });

  // CT2: create:session SEM permissão
  it('CT2 - create_session_can_false', () => {
    const user = mockUser([]);
    const input = { email: 'test@tabnews.com', password: '123456' };
    
    const result = authorization.filterInput(user, 'create:session', input, null);
    
    expect(result).toEqual({});
  });

  // CT3: Feature inválida para create:session
  it('CT3 - create_session_feature_false', () => {
    const user = mockUser(['create:session']);
    const input = { email: 'test@tabnews.com', password: '123456' };
    
    expect(() => {
      authorization.filterInput(user, 'invalid_feature', input, null);
    }).toThrow(ValidationError);
  });

  // CT4: create:user com permissão
  it('CT4 - create_user_can_true', () => {
    const user = mockUser(['create:user']);
    const input = { username: 'ana', email: 'a@a.com', password: '123' };
    
    const result = authorization.filterInput(user, 'create:user', input, null);
    
    expect(result).toEqual({
      username: 'ana',
      email: 'a@a.com',
      password: '123'
    });
  });

  // CT5: create:user SEM permissão
  it('CT5 - create_user_can_false', () => {
    const user = mockUser([]);
    const input = { username: 'ana', email: 'a@a.com', password: '123' };
    
    const result = authorization.filterInput(user, 'create:user', input, null);
    
    expect(result).toEqual({});
  });

  // CT6: update:user com target válido
  it('CT6 - update_user_target_true', () => {
    const user = mockUser(['update:user'], 'user123');
    const target = { id: 'user123' };
    const input = { username: 'ana' };
    
    const result = authorization.filterInput(user, 'update:user', input, target);
    
    expect(result).toEqual({
      username: 'ana',
      email: undefined,
      password: undefined,
      description: undefined,
      notifications: undefined
    });
  });

  // CT7: update:user com target inválido
  it('CT7 - update_user_target_false', () => {
    const user = mockUser(['update:user'], 'user123');
    const target = { id: 'other_user' };
    const input = { username: 'ana' };
    
    const result = authorization.filterInput(user, 'update:user', input, target);
    
    expect(result).toEqual({});
  });

  // CT8: update:user:others com permissão
  it('CT8 - update_user_others_can_true', () => {
    const user = mockUser(['update:user:others']);
    const input = { description: 'test' };
    
    const result = authorization.filterInput(user, 'update:user:others', input, null);
    
    expect(result).toEqual({ description: 'test' });
  });

  // CT9: update:user:others SEM permissão
  it('CT9 - update_user_others_can_false', () => {
    const user = mockUser([]);
    const input = { description: 'test' };
    
    const result = authorization.filterInput(user, 'update:user:others', input, null);
    
    expect(result).toEqual({});
  });

  // CT10: ban:user com permissão
  it('CT10 - ban_user_can_true', () => {
    const user = mockUser(['ban:user']);
    const input = { ban_type: 'temp' };
    
    const result = authorization.filterInput(user, 'ban:user', input, null);
    
    expect(result).toEqual({ ban_type: 'temp' });
  });

  // CT11: ban:user SEM permissão
  it('CT11 - ban_user_can_false', () => {
    const user = mockUser([]);
    const input = { ban_type: 'temp' };
    
    const result = authorization.filterInput(user, 'ban:user', input, null);
    
    expect(result).toEqual({});
  });

  // CT12: read:activation_token com permissão
  it('CT12 - read_token_can_true', () => {
    const user = mockUser(['read:activation_token']);
    const input = { token_id: 'xyz' };
    
    const result = authorization.filterInput(user, 'read:activation_token', input, null);
    
    expect(result).toEqual({ tokenId: 'xyz' });
  });

  // CT13: read:activation_token SEM permissão
  it('CT13 - read_token_can_false', () => {
    const user = mockUser([]);
    const input = { token_id: 'xyz' };
    
    const result = authorization.filterInput(user, 'read:activation_token', input, null);
    
    expect(result).toEqual({});
  });

  // CT14: create:content:text_root com permissão
  it('CT14 - create_root_can_true', () => {
    const user = mockUser(['create:content:text_root']);
    const input = { slug: 'hi', title: 'Test', body: 'Content' };
    
    const result = authorization.filterInput(user, 'create:content:text_root', input, null);
    
    expect(result).toEqual({
      slug: 'hi',
      title: 'Test',
      body: 'Content',
      status: undefined,
      type: undefined,
      source_url: undefined
    });
  });

  // CT15: create:content:text_root SEM permissão
  it('CT15 - create_root_can_false', () => {
    const user = mockUser([]);
    const input = { slug: 'hi', title: 'Test', body: 'Content' };
    
    const result = authorization.filterInput(user, 'create:content:text_root', input, null);
    
    expect(result).toEqual({});
  });

  // CT16: create:content:text_child com permissão
  it('CT16 - create_child_can_true', () => {
    const user = mockUser(['create:content:text_child']);
    const input = { parent_id: 'p1', slug: 'child' };
    
    const result = authorization.filterInput(user, 'create:content:text_child', input, null);
    
    expect(result).toEqual({
      parent_id: 'p1',
      slug: 'child',
      title: undefined,
      body: undefined,
      status: undefined,
      source_url: undefined
    });
  });

  // CT17: create:content:text_child SEM permissão
  it('CT17 - create_child_can_false', () => {
    const user = mockUser([]);
    const input = { parent_id: 'p1', slug: 'child' };
    
    const result = authorization.filterInput(user, 'create:content:text_child', input, null);
    
    expect(result).toEqual({});
  });

  // CT18: update:content com target válido
  it('CT18 - update_content_target_true', () => {
    const user = mockUser(['update:content'], 'user123');
    const target = { owner_id: 'user123' };
    const input = { title: 'Test' };
    
    const result = authorization.filterInput(user, 'update:content', input, target);
    
    expect(result).toEqual({
      parent_id: undefined,
      slug: undefined,
      title: 'Test',
      body: undefined,
      status: undefined,
      source_url: undefined
    });
  });

  // CT19: update:content com target inválido
  it('CT19 - update_content_target_false', () => {
    const user = mockUser(['update:content'], 'user123');
    const target = { owner_id: 'other_user' };
    const input = { title: 'Test' };
    
    const result = authorization.filterInput(user, 'update:content', input, target);
    
    expect(result).toEqual({});
  });
});