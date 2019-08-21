import { Context, createContext, useContext } from 'react';

export interface State {
  [key: string]: any;
}
export const rootState: State = {};

export interface ContextMap {
  [key: string]: Context<any>;
}

export const contextMap: ContextMap = {};

export const Store = {
  unmount: (name: string) => {
    delete rootState[name];
    delete contextMap[name];
  },

  addState: (state: State) => {

    if (typeof state !== 'object') {
      throw new Error(`Ters: state argument has invalid type. Must be of object type.`);
    }

    for (const key in Object.keys(state)) {
      if (rootState[key]) {
        throw new Error(`Ters: a state named "${key}" already exists.`);
      } else {
        rootState[key] = state[key];
      }
    }

  }
};


export const use = <T>(component: any, name: string): T => {
  if (contextMap[name] === undefined) {
    throw new Error(`Ters: a state named ${name} is not defined.`);
  }

  console.dir(component);

  return useContext(contextMap[name]);
}

