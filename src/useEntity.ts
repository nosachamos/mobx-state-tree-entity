import { useContext } from 'react';
import { EntityOptions, TersContext } from './Ters';

// const getEntityIdAttribute = (entity: EntityOptions) => entity.idAttribute ? entity.idAttribute : TersSettings.defaultIdAttribute;

const store = {}

type Store = {
  [key: string]: StoreEntry
}

interface StoreEntry {
  error: any;
  isLoading: boolean;
  instance: any;
  collection: any[];
}



const saveToLocalStorage = (entity: EntityOptions) => <T>(value: T): T => {
  if (entity.isSingleton) {
    localStorage.setItem(entity.name, typeof value === 'string' ? value : JSON.stringify(value));
  } else {
    throw new Error('Ters: not supported yet.');
  }

  return value;
}


const readFromLocalStorage = (entity: EntityOptions) => <T>(): T => {
  if (entity.isSingleton) {
    return localStorage.readItem(entity.name);

  } else {
    throw new Error('Ters: not supported yet.');
  }
}


const deleteFromLocalStorage = (entity: EntityOptions) => (): void => {
  if (entity.isSingleton) {
    localStorage.removeItem(entity.name);

  } else {
    throw new Error('Ters: not supported yet.');
  }
}


export const useEntity = (name: string) => {
  const tersConfig = useContext(TersContext);

  if (!tersConfig.entities[name]) {
    throw new Error(`Ters: you attempted to use an entity named ${name}, but not such entity has been defined.`);
  }

  const entity = tersConfig.entities[name];

  return {
    localStorage: {
      delete: deleteFromLocalStorage(entity),
      read: readFromLocalStorage(entity),
      save: saveToLocalStorage(entity),
    }
  }
}
