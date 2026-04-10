const mineflayer = require('mineflayer')
const express = require('express')

const app = express()

// 🌐 Web server (keeps Render alive)
app.get('/', (req, res) => {
  res.send('Bot is running')
})

app.listen(3000, () => {
  console.log('🌐 Web server started')
})

// 🤖 CREATE BOT
const bot = mineflayer.createBot({
  host: 'rez1-SYkl.aternos.me',
  port: 11149,
  username: 'SleepBot123'
})

// 🛏️ SMART SLEEP FUNCTION
async function smartSleep() {
  if (!bot.time.isNight) return

  const bed = bot.findBlock({
    matching: block => bot.isABed(block)
  })

  if (!bed) {
    console.log('❌ No bed found')
    return
  }

  try {
    await bot.sleep(bed)
    console.log('😴 Sleeping...')
  } catch (err) {
    console.log('⚠️ Sleep error:', err.message)
  }
}

// ✅ WHEN BOT JOINS
bot.once('spawn', () => {
  console.log('✅ Bot joined the server')

  // 🛏️ Sleep system
  setInterval(() => smartSleep(), 10000)

  // 🚶 Random movement
  setInterval(() => {
    if (!bot.entity) return

    const actions = ['forward', 'back', 'left', 'right']
    const action = actions[Math.floor(Math.random() * actions.length)]

    bot.setControlState(action, true)

    setTimeout(() => {
      bot.setControlState(action, false)
    }, 2000)

  }, 4000)

  // ⬆️ Jump sometimes
  setInterval(() => {
    if (!bot.entity) return

    bot.setControlState('jump', true)

    setTimeout(() => {
      bot.setControlState('jump', false)
    }, 500)

  }, 7000)

  // 👀 Look around
  setInterval(() => {
    if (!bot.entity) return

    const yaw = Math.random() * Math.PI * 2
    const pitch = (Math.random() - 0.5) * Math.PI / 2

    bot.look(yaw, pitch, true)

  }, 5000)
})

// 🔁 AUTO RECONNECT
bot.on('end', () => {
  console.log('🔌 Disconnected... reconnecting in 5s')
  setTimeout(() => {
    process.exit() // Render will restart
  }, 5000)
})

// ❌ ERROR HANDLING
bot.on('error', err => console.log('❌ Error:', err))
