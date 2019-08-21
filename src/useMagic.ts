import { createContext, ReactElement, Reducer, useMemo, useReducer } from 'react';




interface HttpActions<T> {
  save(payload: T): T;
  delete(payload: T): void;
  update(payload: T): T;
  read(id: string): T;
  list(): T[];
}

const initialState = {
  timingSettings: {
    error: undefined,
    instance: {
      allowNotificationsToRepeat: false,
      displayInRandomOrder: true,
      fixedDelay: '12',
      id: 'provensocial.myshopify.com',
      showInterval: '4',
      useFixedDelay: false,
      waitBeforeShowing: '6'
    },
    isLoading: false
  }
}







const useTers = () => {

  const defineEntity = (name: string, options: EntityOptions) => {

  }

  return {
    defineEntity
  }
}






const useMagic = <S, T>(state: S): { actions: HttpActions<T> } => {

}


const { actions }  = useMagic(initialState);




const initialState = { count: 0 };



const methods = state => ({
  reset() {
    return initialState;
  },
  increment() {
    state.count++;
  },
  decrement() {
    state.count--;
  },
});
