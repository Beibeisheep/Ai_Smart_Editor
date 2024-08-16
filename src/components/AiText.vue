<template>
	<div>
		<div>
			<!-- 点击展示客服弹窗 -->
			<div class="service" @click="showOptions">
				<svg
					t="1686814946576"
					class="icon"
					viewBox="0 0 1024 1024"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					p-id="2479"
					width="200"
					height="200"
				>
					<path
						d="M959.716928 554.950208M532.429285 958.838931M64.446801 594.626859M270.969435 57.464783"
						fill="#FFFFFF"
						p-id="2480"
					></path>
					<path
						d="M583.719438 385.762901C664.377456 493.897713 810.145377 538.433022 810.145377 538.433022 799.252283 351.240643 687.435615 259.769348 510.411829 258.869862 298.641681 257.789251 175.627996 429.173596 222.010373 597.866646 222.00935 597.866646 580.769246 462.953957 583.719438 385.762901z"
						fill="#FFFFFF"
						p-id="2481"
					></path>
					<path
						d="M843.843874 721.201649c65.939805-16.944927 114.865097-15.887852 114.865097-150.871149 0-65.013713-38.867216-120.714316-93.980441-144.029324C824.128857 272.551466 697.718819 116.236328 507.890402 111.958908c-6.053879-0.135076-12.062733-0.157589-18.004049 0-183.887101 4.724605-309.892933 146.908908-324.069817 311.821865-58.44511 21.626553-102.44216 79.103616-100.462063 146.549727 4.432962 151.456481 66.321498 153.863297 148.712997 155.550729l0-293.098431c1.732457-125.304867 124.495432-264.293385 293.822932-264.293385 168.313404 0 261.415848 130.999566 302.464753 247.369947l0 301.380048c-8.28264 19.399839-30.449499 41.206494-70.936609 80.296791-52.819996 50.971905-128.907928 77.414137-128.907928 77.414137-8.844435 1.867534-15.078417 13.68365-12.603039 23.76424 2.475378 10.082636 13.253862 16.136515 21.605064 12.242835 0 0 80.274278-26.195615 140.430356-84.256986C819.492256 769.20392 843.640236 721.763444 843.843874 721.201649z"
						fill="#FFFFFF"
						p-id="2482"
					></path>
					<path
						d="M375.327224 624.215758m-37.46631 0a36.613 36.613 0 1 0 74.93262 0 36.613 36.613 0 1 0-74.93262 0Z"
						fill="#FFFFFF"
						p-id="2483"
					></path>
					<path
						d="M657.294131 624.215758m-37.46631 0a36.613 36.613 0 1 0 74.93262 0 36.613 36.613 0 1 0-74.93262 0Z"
						fill="#FFFFFF"
						p-id="2484"
					></path>
				</svg>
			</div>
			<!-- 弹窗 -->
			<div v-if="showOptionsModal" class="modal">
				<div class="modal-header">
					<span class="modal-title">服务</span>
					<span class="close-btn" @click="showOptionsModal = false">×</span>
				</div>
				<div class="modal-body">
					<div class="option-list">
						<div class="option-item" @click="openAiCustomerService">AI 客服</div>
						<div class="option-item">一键排版</div>
						<div class="option-item">查错修错</div>
					</div>
				</div>
			</div>

			<!-- AI 客服聊天界面 -->
			<div v-if="showChat" class="chat-modal">
				<div class="modal-header">
					<span class="modal-title">AI 客服</span>
					<span class="close-btn" @click="closeChat">×</span>
				</div>
				<div class="modal-body">
					<div class="kefubox">
						<div v-for="message in chatHistory" :key="message.id">
							<!-- 遍历用户发送的信息，如果role为user就返回信息 -->
							<div v-if="message.sender === 'user'" class="user-message">
								<!-- 用户发送的信息 -->
								<div class="userBox">
									<!-- icon图标 -->
									<svg
										t="1686817502794"
										class="icon"
										viewBox="0 0 1024 1024"
										version="1.1"
										xmlns="http://www.w3.org/2000/svg"
										p-id="3466"
										width="30"
										height="30"
									>
										<path
											fill="#000000"
											d="M500 128.8c-95.2 5.6-173.6 83.2-180 178.4-7.2 112 80.8 205.6 191.2 205.6 106.4 0 192-86.4 192-192 0.8-110.4-92-198.4-203.2-192zM512 575.2c-128 0-383.2 64-383.2 192v96c0 17.6 14.4 32 32 32h702.4c17.6 0 32-14.4 32-32V766.4c0-127.2-255.2-191.2-383.2-191.2z"
											p-id="3467"
										></path>
									</svg>
								</div>
								<!-- 用户输入的问题 -->
								<span>{{ message.text }}</span>
							</div>
							<div v-else class="bot-message" style="margin: 5px 0px; padding: 5px 10px">
								<!-- icon图标 -->
								<div style="display: flex; align-items: center; margin-right: 10px">
									<svg
										t="1686814946576"
										class="icon"
										viewBox="0 0 1024 1024"
										version="1.1"
										xmlns="http://www.w3.org/2000/svg"
										p-id="2479"
										width="30"
										height="30"
									>
										<path
											d="M959.716928 554.950208M532.429285 958.838931M64.446801 594.626859M270.969435 57.464783"
											fill="#000000"
											p-id="2480"
										></path>
										<path
											d="M583.719438 385.762901C664.377456 493.897713 810.145377 538.433022 810.145377 538.433022 799.252283 351.240643 687.435615 259.769348 510.411829 258.869862 298.641681 257.789251 175.627996 429.173596 222.010373 597.866646 222.00935 597.866646 580.769246 462.953957 583.719438 385.762901z"
											fill="#000000"
											p-id="2481"
										></path>
										<path
											d="M843.843874 721.201649c65.939805-16.944927 114.865097-15.887852 114.865097-150.871149 0-65.013713-38.867216-120.714316-93.980441-144.029324C824.128857 272.551466 697.718819 116.236328 507.890402 111.958908c-6.053879-0.135076-12.062733-0.157589-18.004049 0-183.887101 4.724605-309.892933 146.908908-324.069817 311.821865-58.44511 21.626553-102.44216 79.103616-100.462063 146.549727 4.432962 151.456481 66.321498 153.863297 148.712997 155.550729l0-293.098431c1.732457-125.304867 124.495432-264.293385 293.822932-264.293385 168.313404 0 261.415848 130.999566 302.464753 247.369947l0 301.380048c-8.28264 19.399839-30.449499 41.206494-70.936609 80.296791-52.819996 50.971905-128.907928 77.414137-128.907928 77.414137-8.844435 1.867534-15.078417 13.68365-12.603039 23.76424 2.475378 10.082636 13.253862 16.136515 21.605064 12.242835 0 0 80.274278-26.195615 140.430356-84.256986C819.492256 769.20392 843.640236 721.763444 843.843874 721.201649z"
											fill="#000000"
											p-id="2482"
										></path>
										<path
											d="M375.327224 624.215758m-37.46631 0a36.613 36.613 0 1 0 74.93262 0 36.613 36.613 0 1 0-74.93262 0Z"
											fill="#000000"
											p-id="2483"
										></path>
										<path
											d="M657.294131 624.215758m-37.46631 0a36.613 36.613 0 1 0 74.93262 0 36.613 36.613 0 1 0-74.93262 0Z"
											fill="#000000"
											p-id="2484"
										></path>
									</svg>
								</div>
								<!-- icon图标结束 -->
								<span>{{ message.text }}</span>
							</div>
						</div>
					</div>
					<!-- 输入框 -->
					<div class="modal-footer">
						<div class="iptbox">
							<div>
								<input
									type="text"
									name=""
									id=""
									v-model="userInput"
									@keyup.enter="sendMessage"
									placeholder="请输入要查询的问题..."
								/>
								<button @click="sendMessage">发送</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

export default {
	data() {
		return {
			showOptionsModal: false,
			showChat: false, // 控制 AI 客服聊天界面的显示
			userInput: '',
			chatHistory: [],
			// 控制请求频率
			lastRequestTime: 0,
			requestDelay: 2000 // 2 秒的延迟
		}
	},
	methods: {
		showOptions() {
			this.showOptionsModal = true
			console.log('打开选择弹窗cccccccccccccc')
		},
		openAiCustomerService() {
			console.log('关闭选择弹窗发；；；；；；；；；；；；；；；')
			this.showOptionsModal = false
			console.log('打开AI客服fffffffffffffffff')
			this.showChat = true
		},
		closeChat() {
			this.showChat = false
		},
		async sendMessage() {
			if (!this.userInput.trim()) return

			// 将用户消息添加到聊天历史中
			const userMessage = {
				id: uuidv4(),
				sender: 'user',
				text: this.userInput
			}
			this.chatHistory.push(userMessage)

			// 检查上次请求时间，并控制请求频率
			const now = Date.now()
			if (now - this.lastRequestTime < this.requestDelay) {
				console.log('请求频率过快，等待', this.requestDelay - (now - this.lastRequestTime), '毫秒')
				return // 等待 2 秒后再发送请求
			}
			this.lastRequestTime = now

			// 准备请求
			const apiKey = ''
			const apiUrl = 'https://api.openai.com/v1/chat/completions'
			const headers = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`
			}

			// 请求数据
			const data = {
				model: 'gpt-3.5-turbo',
				messages: [
					{
						role: 'system',
						content: 'You are a helpful assistant.'
					},
					{
						role: 'user',
						content: this.userInput
					}
				]
			}

			try {
				const response = await axios.post(apiUrl, data, { headers })
				const assistantMessage = {
					id: uuidv4(),
					sender: 'assistant',
					text: response.data.choices[0].message.content
				}

				// 将助手消息添加到聊天历史中
				this.chatHistory.push(assistantMessage)
				this.userInput = ''
			} catch (error) {
				console.error('Error sending message:', error)
			}
		}
	}
}
</script>

<style scoped>
.service {
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	bottom: 50px; /* 靠近页面底部 */
	right: 50px; /* 靠近页面右侧 */
	background-color: #004dff;
	width: 60px;
	height: 60px;
	border-radius: 50%;
	padding: 5px;
	box-shadow: 4px 10px 10px -7px black;
	cursor: pointer;
}

.modal {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: #fff;
	border-radius: 10px;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
	width: 600px;
	height: 600px;
	z-index: 1000;
	max-height: 90vh; /* 确保模态框不会超过视窗高度 */
	overflow: hidden; /* 防止内容溢出 */
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #004dff;
	color: #fff;
	padding: 15px 20px; /* 增加内边距 */
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
}

.modal-title {
	font-size: 1.5rem; /* 增大字体 */
	font-weight: bold;
}

.close-btn {
	font-size: 1.5rem;
	cursor: pointer;
}

.modal-body {
	padding: 20px; /* 增加内边距 */
	overflow-y: auto; /* 增加滚动支持 */
}

.modal-footer {
	padding: 15px 20px; /* 增加内边距 */
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
	display: flex;
	justify-content: flex-end;
}

.iptbox {
	display: flex;
	align-items: center;
	position: relative;
}

.iptbox input {
	width: 85%; /* 使用百分比宽度 */
	height: 40px;
	padding-left: 10px; /* 增加内边距 */
	padding-right: 70px; /* 增加内边距 */
	border-radius: 10px;
	border: 1px solid #ccc; /* 添加边框 */
}

.iptbox button {
	width: 60px;
	height: 35px;
	position: absolute;
	right: 5px; /* 增加位置调整 */
	top: 5px;
	border-radius: 10px;
	border: none;
	background-color: #707070;
	color: #fff;
	font-weight: 600;
}

.chat-modal {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 80%;
	max-width: 500px;
	background: #fff; /* Adjust as needed */
	border-radius: 8px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	z-index: 1000;
}

.bot-message,
.user-message {
	display: flex;
	align-items: center;
	margin-bottom: 10px; /* 增加底部间距 */
}

.bot-message {
	background-color: #e0e0e0; /* 修改背景色 */
	color: #000;
	border-radius: 10px;
	padding: 10px 15px; /* 增加内边距 */
}

.user-message {
	background-color: #d1d1d1; /* 修改背景色 */
	color: #000;
	padding: 10px 15px; /* 增加内边距 */
	border-radius: 10px;
}

.userBox {
	margin-right: 15px; /* 增加右间距 */
	display: flex;
	align-items: center;
}

.option-list {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.option-item {
	background-color: #f0f0f0;
	padding: 10px;
	border-radius: 5px;
	cursor: pointer;
	color: #000; /* 设置文本颜色 */
}
</style>
