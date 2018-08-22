import { Ability, AbilityBuilder } from "@casl/ability";
import { packRules, unpackRules } from "@casl/ability/extra";
import { IUser } from '../models/user';

const admin = AbilityBuilder.define((can: any) => {
  can("read", "all");
  can("manage", "all");
});

const moderator = AbilityBuilder.define((can: any) => {
  can("read", "all");
  can("update", "all");
});

const user = AbilityBuilder.define((can: any) => {
  can("read", "all");
});

interface IABILITES {
  admin: Ability;
  moderator: Ability;
  user: Ability;
  [index: string]: Ability;
}

export const ABILITES: IABILITES = {
  admin,
  moderator,
  user
};

export function getAbilities(user: IUser, packed = true) {
  const ability = ABILITES[user.role] || ABILITES.user;

  if (packed) {
    return packRules(ability.rules);
  }

  return ability;
}

export function getAbilitiesFromToken(decodedToken: any) {
  return new Ability(unpackRules(decodedToken.rules));
}
