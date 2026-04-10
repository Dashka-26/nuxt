export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  console.log('Received payment data:', body)

  return {
    success: true,
    message: 'Subscription created successfully!',
    data: body
  }
})
