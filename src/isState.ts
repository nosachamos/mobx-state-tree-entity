import { contextMap } from './Store';


function wrapValidator(validator: any, typeName: string, typeChecker: any = null): object {
  return Object.assign(validator.bind(), {
    isRequired: Object.assign(validator.isRequired.bind(), {
      typeChecker,
      typeName,
      typeRequired: true,
    }),
    typeChecker,
    typeName,
  });
}


const requiredIsState = (_: Props, propName: string, componentName: string): Error | null => {
  const stateValue = contextMap[propName];

  if (typeof stateValue === 'undefined') {
    return new RangeError(`${componentName} is configured to access a state named ${propName}.` +
      `This state is marked as required, but none was found.` +
      `Make sure a state with this name is defined prior to mounting the component.`);
  }

  return null;
}

interface Props {
  [key: string]: any;
}

const isStateOptional = (props: Props, propName: string, componentName: string): Error | null => {
  const { [propName]: stateValue } = contextMap;

  if (stateValue === null || stateValue === undefined) {
    return null;
  }

  return requiredIsState(props, propName, componentName);
};

isStateOptional.isRequired = requiredIsState;

export default wrapValidator(isStateOptional, 'isState')
