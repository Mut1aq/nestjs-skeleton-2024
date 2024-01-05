import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SCHEMAS } from 'shared/constants/schemas.constant';

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    minlength: 5,
    maxlength: 320,
    required: true,
    unique: true,
  })
  email!: string;

  @Prop({
    type: String,
    minlength: 3,
    maxlength: 30,
    required: true,
    unique: true,
  })
  username!: string;

  @Prop({ type: String, required: true })
  password!: string;
}

const UserSchema = SchemaFactory.createForClass(User);

export const userMongooseModel: ModelDefinition = {
  name: SCHEMAS.USERS,
  schema: UserSchema,
};
