import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from '../users.service';

@ValidatorConstraint({ name: 'UniqueColumn', async: true })
@Injectable()
export class UniqueColumnValidator implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}
  async validate(
    value: string,
    validationArguments: ValidationArguments,
  ): Promise<boolean> {
    const [property] = validationArguments.constraints!;
    const user = await this.usersService.findUserByColumn(property, value);

    if (!!user) return false;

    return true;
  }
}

export const UniqueColumn = (
  property: string,
  validationOptions?: ValidationOptions,
) => {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions!,
      validator: UniqueColumnValidator,
      constraints: [property],
    });
  };
};
