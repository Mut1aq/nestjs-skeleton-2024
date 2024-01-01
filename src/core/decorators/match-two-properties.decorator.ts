import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DynamicObjectI } from 'shared/interfaces/general/dynamic-object.interface';

@ValidatorConstraint({ name: 'MatchTwoProperties' })
class MatchTwoPropertiesValidator implements ValidatorConstraintInterface {
  async validate(
    value: unknown,
    validationArguments: ValidationArguments,
  ): Promise<boolean> {
    const [property] = validationArguments.constraints!;
    const dtoObject = validationArguments.object as DynamicObjectI;

    return dtoObject[property] === value;
  }
}

export const MatchTwoProperties = (
  property: string,
  validationOptions?: ValidationOptions,
) => {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions!,
      validator: MatchTwoPropertiesValidator,
      constraints: [property],
    });
  };
};
