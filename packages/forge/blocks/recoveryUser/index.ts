import { createBlock } from '@typebot.io/forge'
import { RecoveryUserLogo, RecoveryUserDarkLogo } from './logo'
import { recoveryUser } from './actions/getStatusUser'

export const recoveryUserBlock = createBlock({
  id: 'recovery-user',
  name: 'User',
  tags: [],
  LightLogo: RecoveryUserLogo,
  DarkLogo: RecoveryUserDarkLogo,
  actions: [recoveryUser],
})
