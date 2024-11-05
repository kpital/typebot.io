import { createBlock } from '@typebot.io/forge'
import { RecoveryUserLogo, RecoveryUserDarkLogo } from './logo'
import { getStatusUser } from './actions/getStatusUser'

export const recoveryUserBlock = createBlock({
  id: 'recovery-user',
  name: 'Recovery User',
  tags: [],
  LightLogo: RecoveryUserLogo,
  DarkLogo: RecoveryUserDarkLogo,
  actions: [getStatusUser],
})
