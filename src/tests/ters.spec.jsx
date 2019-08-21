import React from 'react';
import { Store } from '../Store';
import { mount } from 'enzyme';
import { Ters } from '../Ters';
import { useEntity } from '../useEntity';

describe('Ters', () => {

  it(`Can use localStorage methods to persist singleton entity.`, () => {

    try {
      const initialState = Math.random() + '';
      const updatedState = Math.random() + '';

      const App = ({children}) => {
        const entities = [{
          name: 'settings',
          isSingleton: true
        }];

        return <Ters {entities}>{children}</Ters>;
      }

      const Component = () => {
        const { instance, localStorage } = useEntity('settings');
        return (
          <div>
            <span>My content: {instance.value}</span>
            <button onClick={localStorage.read()}>Read</button>
            <button onClick={localStorage.save(updatedState)}>Save</button>
            <button onClick={localStorage.delete()}>Delete</button>
          </div>
        );
      }

      mount(<App><Component/></App>);

    } finally {
      Store.unmount(STATE_NAME);
    }
  });
  //

});
