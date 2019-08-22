import {
  applySnapshot,
  flow,
  IAnyModelType,
  IAnyType,
  IModelType,
  ISimpleType,
  ModelProperties,
  OptionalDefaultValueOrFunction,
  types,
  getParent,
  getSnapshot
} from 'mobx-state-tree';
import axios from 'axios';

export declare type ExtractProps<
  T extends IAnyModelType
> = T extends IModelType<infer P, any, any, any> ? P : never;

const metadata = types
  .model('Metadata', {
    error: types.maybeNull(types.string),
    hasLoaded: types.optional(types.boolean, false),
    isLoading: types.optional(types.boolean, false)
  })
  .views(self => ({
    get isDirty(): boolean {
      // ephemeral value doesn't match persisted one - model is dirty
      const { value } = getParent(self);
      const { persistedValue } = getParent(self);
      return (
        persistedValue &&
        value &&
        JSON.stringify(value) !== JSON.stringify(persistedValue)
      );
    },
    get hasError(): boolean {
      return !!self.error;
    }
  }));

export type ModelPropertyDefinitionsToProperties<T extends IAnyModelType> = {
  [P in keyof ExtractProps<T>]: ExtractProps<T>[P] extends ISimpleType<infer X>
    ? X
    : never;
};

const deriveTypeFromStateKey = (value: any): IAnyType => {
  switch (typeof value) {
    case 'string':
      return types.string;

    case 'boolean':
      return types.boolean;

    case 'number':
      return types.number;

    case 'object':
      if (Array.isArray(value)) {
        // if the array is empty, we assume it is an array of strings
        if (value.length === 0) {
          return types.array(types.string);
        } else {
          // else, we assume the type of items in the array matches the type of the array's first item
          return types.array(deriveTypeFromStateKey(value[0]));
        }
      } else {
        // if this is a full object, we recursively derive an entity model from it
        return deriveModelFromState(value);
      }

      break;

    default:
      throw new Error('state-to-mox-state-tree-types');
  }
};

export const deriveModelFromState = (state: { [key: string]: any }) => {
  if (typeof state !== 'object' || Array.isArray(state)) {
    throw new Error(''); // TODO: proper error msg
  } else {
    const modelProps: any = {};
    for (const key of Object.keys(state)) {
      const value = state[key];
      modelProps[key] = deriveTypeFromStateKey(value);
    }

    return types.model(modelProps).actions(self => ({
      setValues: (values: typeof self) => {
        // compose the snapshot with existing properties so we can submit partial updates
        const updateContent = { ...self, ...values };
        applySnapshot(self, updateContent);
      }
    }));
  }
};

export const useSingletonEntity = <
  P extends ModelProperties,
  O,
  T extends IModelType<P, O>,
  I extends ModelPropertyDefinitionsToProperties<T>
>(
  initialValue: I,
  endpoint: string
) => {
  const instanceType: IModelType<P, any> = deriveModelFromState(initialValue);

  const apiEntityModel = types
    .model('', {
      metadata,
      persistedValue: types.optional(instanceType, initialValue),
      value: types.optional(instanceType, initialValue)
    })
    .actions(self => ({
      read: flow(function* get(id?: string | number): IterableIterator<any> {
        self.metadata.isLoading = true;
        try {
          const url = id ? endpoint + '/' + id : endpoint;
          const response = yield axios.get(url);
          applySnapshot(self.value, response.data);
          applySnapshot(self.persistedValue, response.data);
        } catch (e) {
          self.metadata.error = JSON.stringify(e);
        } finally {
          self.metadata.isLoading = false;
        }

        return self.persistedValue;
      }),
      update: flow(function* update(
        id?: string | number
      ): IterableIterator<any> {
        self.metadata.isLoading = true;
        try {
          const url = id ? endpoint + '/' + id : endpoint;
          const response = yield axios.put(url, self.value);

          console.dir(getSnapshot(self.value));
          console.dir(getSnapshot(self.persistedValue));
          console.dir(response.data);

          console.log('response: ' + JSON.stringify(response.data));
          const resJson = JSON.stringify(response.data);
          console.log('applying: ' + resJson);
          applySnapshot(self.persistedValue, response.data);
          applySnapshot(self.value, response.data);
          console.log('applied!');
        } catch (e) {
          console.log(e);
          self.metadata.error = JSON.stringify(e);
        } finally {
          self.metadata.isLoading = false;
        }

        return self.persistedValue;
      })
    }));

  const remoteEntity = <IT extends IAnyType>(
    entityInstance: [IT, OptionalDefaultValueOrFunction<IT>]
  ) => types.optional(entityInstance[0], entityInstance[1]);

  const devicesRemoteEntity = [
    apiEntityModel,
    {
      metadata: {
        error: null,
        hasLoaded: false,
        isDirty: false,
        isLoading: false
      },
      value: initialValue
    }
  ] as [typeof apiEntityModel, SingletonEntity<typeof initialValue>];

  return remoteEntity(devicesRemoteEntity);
};

interface SingletonEntity<V> {
  value: V;
  persistedValue: V;
  isDirty: boolean;
  metadata: {
    isLoading: boolean;
    isDirty: boolean;
    hasLoaded: boolean;
    error?: any;
  };
}
