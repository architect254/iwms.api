import {  
  ValidatorConstraint,  
  ValidatorConstraintInterface,  
  ValidationArguments,  
  registerDecorator,  
  ValidationOptions,  
} from 'class-validator';  

interface IsUsernameUniqueOptions {  
  server: string;  
  message?: string;  
}  

@ValidatorConstraint({ name: 'IsUsernameUnique', async: true })  
export class IsUsernameUniqueConstraint  
  implements ValidatorConstraintInterface  
{  
  async validate(username: string, args: ValidationArguments) {  
    const options = args.constraints[0] as IsUsernameUniqueOptions;  
    const server = options.server;  

    // server check, let assume username exist  
    return !(await this.checkUsernameOnServer(username, server));  
  }  

  defaultMessage(args: ValidationArguments) {  
    const options = args?.constraints[0] as IsUsernameUniqueOptions;  
    return options?.message || 'Username is already taken';  
  }  

  async checkUsernameOnServer(username: string, server: string) {  
    return true;  
  }  
}  

export function IsUsernameUnique(  options: IsUsernameUniqueOptions,  
  validationOptions?: ValidationOptions,) {  
  return function (object: object, propertyName: string) {  
    registerDecorator({  
      target: object.constructor,  
      propertyName: propertyName,  
      options: validationOptions,  
      constraints: [options],  
      validator: IsUsernameUniqueConstraint,  
    });  
  };  
}