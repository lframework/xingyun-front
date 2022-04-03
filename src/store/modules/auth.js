import settings from '@/config'

export default {
  namespaced: true,
  state: {
    token: undefined
  },
  getters: {
    token: state => {
      if (!state.token) {
        try {
          const token = localStorage.getItem(settings.tokenKey)
          state.token = token
        } catch (e) {
          console.error(e)
        }
      }
      return state.token
    }
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      localStorage.setItem(settings.tokenKey, token)
    },
    removeToken(state) {
      state.token = undefined
      localStorage.removeItem(settings.tokenKey)
    }
  }
}
