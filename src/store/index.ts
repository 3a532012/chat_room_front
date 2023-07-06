import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import VuexPersistence from 'vuex-persist';

type RootState = {
    userInfo : {
        token: string
        userName: string
        id: string
    } | null
}
const vuexLocal = new VuexPersistence<RootState>({
    storage: window.localStorage,
});
export const key: InjectionKey<Store<RootState>> = Symbol();

export const store = createStore<RootState>({
    state: {
        userInfo: null,
    },
    mutations:{
        updateUserInfo(state, payload) {
            state.userInfo = payload
        },
        initUserInfo(state) {
            state.userInfo = null
        }
    },
    plugins: [vuexLocal.plugin],
});
export function useStore() {
    //only use import on *.vue
    return baseUseStore(key);
}