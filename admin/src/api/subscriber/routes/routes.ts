export default {
  routes: [
    {
      path: '/subscribers/update/:id',
      method: 'POST',
      handler: 'subscriber.updateCheck',
    }
  ],
}