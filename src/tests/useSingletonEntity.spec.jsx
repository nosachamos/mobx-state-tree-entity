import { useSingletonEntity } from '../useSingletonEntityl';

describe('Singleton entities', () => {
  it('Can build a singleton entity from an initial state with various property types', () => {
    const initialState = {
      string: 'string-value',
      booleanProp: true,
      numberProp: 10,
      subModel: {
        string: 'string-value',
        booleanProp: true,
        numberProp: 10
      }
    };

    const model = useSingletonEntity(
      initialState,
      'https://api-dev.provensocial.io/v1/settings/devices'
    );

    expect(model).not.toBeNull();
  });
});
