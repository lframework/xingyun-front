export default {
  namespaced: true,
  state: {
    token: undefined
  },
  getters: {
    token: state => {
      if (!state.token) {
        try {
          const token = localStorage.getItem('X-Auth-Token')
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
      localStorage.setItem('X-Auth-Token', token)
    },
    removeToken(state) {
      state.token = undefined
      localStorage.removeItem('X-Auth-Token')
    }
  }
}
