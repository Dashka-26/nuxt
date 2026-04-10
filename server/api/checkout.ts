export default defineEventHandler((event) => {
  const query = getQuery(event)
  const planId = Number(query.plan)

  const allPlans = [
    {
      id: 1,
      name: 'Starter - Annual',
      trialText: '3-days free then:',
      price: '83.25',
      oldYearly: '$1,188',
      newYearly: '$999',
      savings: '$189 in savings',
      color: 'from-[#73ff00] to-cyan-400',
      summaryTotal: '999.00',
      features: [
        { text: 'Primary user only', subtext: '(extra team members for $35/month)' },
        { text: 'Save unlimited properties' },
        { text: '10,000 exports', subtext: '(additional exports at $0.02 each)', boldText: '10,000' },
        { text: '500 free skip traces', subtext: '(additional skip tracing at $0.08 each)', boldText: '500' },
        { text: 'Imports $0.01' },
        { text: 'FREE daily product trainings and support', boldText: 'FREE' },
        { text: 'Full suite of next-gen investing tools' },
        { text: 'Industry first AI powered comp tool' },
        { text: 'Includes dedicated support agent' }
      ]
    },
    {
      id: 2,
      name: 'Team - Annual',
      trialText: '3-days free then:',
      price: '207.50',
      oldYearly: '$2,988',
      newYearly: '$2,490',
      savings: '$498 in savings',
      color: 'from-[#73ff00] to-cyan-400',
      summaryTotal: '2490.00',
      features: [
        { text: 'Primary user + 2 free team members', subtext: '(extra team members for $25/month)' },
        { text: 'Save unlimited properties' },
        { text: '50,000 exports', subtext: '(additional exports at $0.01 each)', boldText: '50,000' },
        { text: '1,000 free skip traces', subtext: '(additional skip tracing at $0.08 each)', boldText: '1,000' },
        { text: 'Imports $0.01' },
        { text: 'FREE daily product trainings and support', boldText: 'FREE' },
        { text: 'Full suite of next-gen investing tools' },
        { text: 'Industry first AI powered comp tool' },
        { text: 'Includes dedicated support agent' }
      ]
    },
    {
      id: 3,
      name: 'Business - Annual',
      trialText: '3-days free then:',
      price: '457.50',
      oldYearly: '$6,588',
      newYearly: '$5,490',
      savings: '$1,098 in savings',
      color: 'from-[#73ff00] to-cyan-400',
      summaryTotal: '5490.00',
      features: [
        { text: 'Primary user + 6 free team members', subtext: '(extra team members for $20/month)' },
        { text: 'Save unlimited properties' },
        { text: '100,000 exports', subtext: '(additional exports at $0.01 each)', boldText: '100,000' },
        { text: '2,000 free skip traces', subtext: '(additional skip tracing at $0.08 each)', boldText: '2,000' },
        { text: 'Imports $0.01' },
        { text: 'FREE daily product trainings and support', boldText: 'FREE' },
        { text: 'Full suite of next-gen investing tools' },
        { text: 'Industry first AI powered comp tool' },
        { text: 'Includes dedicated support agent' }
      ]
    }
  ]

  const selectedPlan = allPlans.find(p => p.id === planId) || allPlans[1]

  if (!selectedPlan) {
    throw createError({ statusCode: 404, statusMessage: 'Plan not found' })
  }

  return {
    plan: selectedPlan,
    summary: {
      annualPlan: selectedPlan.summaryTotal,
      totalDue: selectedPlan.summaryTotal,
      dueToday: '0.00'
    }
  }
})
