import Vuex from 'vuex'
import {Auth, GoogleAuthProvider} from '~/plugins/firebase-client-init.js'

function buildUserObject (authData) {
  let { email, displayName, uid, photoURL } = authData.user
  let user = {}
  user['email'] = email
  user['name'] = displayName
  user['uid'] = uid
  user['picture'] = photoURL
  return user
}

const createStore = () => {
  return new Vuex.Store({
    state: {
      user: null,
      loading: false
    },

    getters: {
      activeUser: (state, getters) => {
        return state.user
      },
      isLoading: (state, getters) => {
        return state.loading
      }
    },

    mutations: {
      setUser (state, payload) {
        state.user = payload
      },
      setLoading (state, payload) {
        state.loading = payload
      }
    },

    actions: {
      nuxtServerInit ({ commit }, { req }) {
        if (req.user) {
          commit('setUser', req.user)
        }
      },

      async signInWithGooglePopup ({commit}) {
        commit('setLoading', true)
        let authData = await Auth.signInWithPopup(GoogleAuthProvider)
        commit('setUser', buildUserObject(authData))
        commit('setLoading', false)
      },

      async signOut ({commit}) {
        await Auth.signOut()
        commit('setUser', null)
      }
    }
  })
}

export default createStore
