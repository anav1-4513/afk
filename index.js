const mineflayer = require('mineflayer')
const { pathfinder, goals } = require('mineflayer-pathfinder')

function createBot() {
  const bot = mineflayer.createBot({
    host: 'rez1-SYkl.aternos.me',
    port: 11149,
    username: 'ProBot'
  })

  bot.loadPlugin(pathfinder)

  bot.once('spawn', () => {
    console.log('✅ Pro Bot Joined')

    // 🌙 Smart sleep check
    setInterval(() => smartSleep(bot), 10000)

    // 🏃 Random movement
    setInterval(() => randomMove(bot), 15000)

    // 🔄 Anti-AFK jump
    setInterval(() => {
      if (bot.entity) {
        bot.setControlState('jump', true)
        setTimeout(() => bot.setControlState('jump', false), 500)
      }
    }, 30000)
  })

  // 💬 Chat commands
  bot.on('chat', (username, message) => {
    if (username === bot.username) return

    if (message === 'come') {
      const player = bot.players[username]
      if (!player || !player.entity) return

      const goal = new goals.GoalNear(
        player.entity.position.x,
        player.entity.position.y,
        player.entity.position.z,
        2
      )
      bot.pathfinder.setGoal(goal)
      bot.chat('Coming 😎')
    }

    if (message === 'sleep') {
      smartSleep(bot, true)
    }

    if (message === 'follow me') {
      const player = bot.players[username]
      if (!player || !player.entity) return

      const goal = new goals.GoalFollow(player.entity, 2)
      bot.pathfinder.setGoal(goal, true)
      bot.chat('Following you 👀')
    }
  })

  bot.on('wake', () => {
    console.log('🌅 Woke up!')
  })

  bot.on('end', () => {
    console.log('🔄 Reconnecting...')
    setTimeout(createBot, 10000)
  })

  bot.on('error', err => console.log(err))
}

// 🧠 SMART SLEEP FUNCTION
async function smartSleep(bot, force = false) {
  if (!bot.time.isNight && !force) return

  const players = Object.values(bot.players)
  const sleepingPlayers = players.filter(p => p.entity && p.entity.isSleeping)

  if (!force && sleepingPlayers.length === 0) {
    console.log('🌙 Night but no one sleeping')
    return
  }

  console.log('🛏️ Going to bed...')

  const bed = bot.findBlock({
    matching: block => bot.isABed(block),
    maxDistance: 20
  })

  if (!bed) {
    console.log('❌ No bed found')
    return
  }

  const goal = new goals.GoalBlock(
    bed.position.x,
    bed.position.y,
    bed.position.z
  )

  bot.pathfinder.setGoal(goal)

  setTimeout(async () => {
    try {
      await bot.sleep(bed)
      console.log('😴 Sleeping...')
    } catch (err) {
      console.log('Sleep error:', err.message)
    }
  }, 5000)
}

// 🏃 RANDOM MOVEMENT
function randomMove(bot) {
  if (!bot.entity) return

  const x = bot.entity.position.x + (Math.random() * 6 - 3)
  const z = bot.entity.position.z + (Math.random() * 6 - 3)

  const goal = new goals.GoalNear(x, bot.entity.position.y, z, 1)
  bot.pathfinder.setGoal(goal)

  console.log('🚶 Moving randomly')
}

createBot()