import { createStore } from 'vuex'
import User from '../stores/user'
import MenuKey from './menuKey'
import ItemKey from './itemKey'
import Text from './text'
export default createStore({
	state: {},
	getters: {},
	mutations: {},
	actions: {},
	modules: {
		user: User, //防止store变得臃肿，其实就相当于一个名为user子模块,
		menuKey: MenuKey,
		itemKey: ItemKey, // 注册 itemKey 模块
		text: Text
	}
})
