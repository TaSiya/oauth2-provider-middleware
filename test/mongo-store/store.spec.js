const mongodb = require('mongodb');
const buildMongoStore = require('../../src/store/build-mongo-store');

const { MongoClient } = mongodb;

const uri = process.env.MONGO_URL || 'mongodb://localhost/oauth2-provider-middleware-test';

const collections = {
  Clients: 'clients',
  Users: 'users'
  // TODO: more
};

beforeAll(async () => {
  const db = await MongoClient.connect(uri, { useNewUrlParser: true }).then(c => c.db());
  /* eslint-disable no-restricted-syntax */
  for (const c of Object.keys(collections)) {
    /* eslint-disable no-await-in-loop */
    await db.collection(collections[c]).remove({});
  }

  await db.collection('clients').insertMany([
    {
      clientId: '123',
      redirectUris: ['bla', 'blu'],
      implicitFlow: true,
      scopes: ['scope1', 'scope2']
    },
    {
      clientId: '321',
      redirectUris: ['ble', 'bli'],
      implicitFlow: false,
      scopes: ['scope']
    },
    {
      clientId: '125',
      redirectUris: ['bla', 'blu']
    }
  ]);
});

// afterAll(() => {
//   return ;
// });

describe('Mongo Store', () => {
  it('fails without params', () => {
    expect(buildMongoStore).toThrow(/uri/);
  });
  it('succeeds with params', () => {
    const store = buildMongoStore({ uri, mongodb });
    expect(store.db).toBeTruthy();
    expect(store.getClientById).toBeTruthy();
  });
  describe('getClientById', () => {
    it('maps properties as expected for client_id 123', async () => {
      const store = buildMongoStore({ uri, mongodb });
      const client = await store.getClientById('123');
      expect(client.client_id).toBe('123');
      expect(client.redirect_uris).toEqual(['bla', 'blu']);
      expect(client.implicitFlow).toBe(true);
      expect(client.scopes).toEqual(['scope1', 'scope2']);
    });
    it('maps properties as expected for client_id 321', async () => {
      const store = buildMongoStore({ uri, mongodb });
      const client = await store.getClientById('321');
      expect(client.client_id).toBe('321');
      expect(client.redirect_uris).toEqual(['ble', 'bli']);
      expect(client.implicitFlow).toBe(false);
      expect(client.scopes).toEqual(['scope']);
    });
    // it('check for exisiting client', async () => {
    //   const store = buildMongoStore({ uri, mongodb });
    //   const client = await store.getClientById('456')
    //   // expect(client.client_id).toBeFalsely();
    // })
  });
});
