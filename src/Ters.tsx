import React, { createContext, ReactElement, useContext, useEffect, useState } from 'react';

export const TersSettings = {
  defaultIdAttribute: 'id'
}


interface TersContextValue {
  entities: { [key: string]: EntityOptions }
}

export const TersContext = createContext<TersContextValue>({
  entities: {}
});

export interface EntityOptions {
  name: string,
  idAttribute: string,
  isSingleton?: boolean,
  apiRoot?: string
}

interface TersProps {
  children: ReactElement,
  entities: EntityOptions[]
}

export const Ters = ({ children, entities }: TersProps) => {
  const tersConfig = useContext(TersContext);
  const [originalEntities] = useState({...tersConfig.entities});

  entities.forEach(e => {
    if (tersConfig.entities[e.name]) {
      throw new Error(`Ters: an entity named ${e.name} is already defined. Entity names within an app must be unique.`);

    } else {
      tersConfig.entities[e.name] = e;
    }
  });

  useEffect(() =>
    () => { // return a cleanup function that removes the given entities when the calling component is unmounted.
      tersConfig.entities = originalEntities;
    }, []
  );

  return (
    <TersContext.Provider value={tersConfig}>
      {children}
    </TersContext.Provider>
  );

};

