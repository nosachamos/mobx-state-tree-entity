import React from 'react';
import { Store } from '../Store';

describe('Ters', () => {

  [
    { name: 'boolean (false)', value: false },
    { name: 'boolean (true)', value: true },
    { name: 'numeric', value: 123 },
    { name: 'array', value: [] },
    { name: 'string', value: 'abc' },
    { name: 'null', value: null },
    { name: 'undefined', value: undefined }
  ].forEach(t =>
    it(`Error is raised when state name of ${t.name} type is given.`, () => {
      const performAction = () => Store.addState(t.value);

      expect(performAction).toThrowError(
        new Error('Ters: state argument has invalid type. Must be of object type.')
      );

    })
  );

  it(`Error is raised when attempting to add state with existing key.`, () => {
    const name = 'stateName';
    Store.addState({a: '', b: ''})
    const performAction = () => Store.addState({b: ''});

    expect(performAction).toThrowError(
      new Error(`Ters: a state named "b" already exists.`)
    );

  })

});
