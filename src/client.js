import { useContext, useMemo } from 'react';
import { GraphQLClient } from 'graphql-request';
import Context from './context'

export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'http://121.41.131.227:4000/graphql'
    : 'http://121.41.131.227:4000/graphql';

export const useClient = () => {
  const { state } = useContext(Context);
  
  const token = useMemo(() => !!state.currentUser && state.currentUser.name ,[ state.isAuth ])

  return new GraphQLClient(BASE_URL, {
    headers: { authorization: token }
  });
};
