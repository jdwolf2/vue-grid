// vue-grid/src/composables/useDynamoDB.js

import { ref } from 'vue'
import { Auth } from '@aws-amplify/auth'
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

export function useDynamoDB() {
  const items = ref([])
  const itemsFetched = ref(false)
  const fetchError = ref('')

  /**
   * @param {string} startValue – UNIX‐seconds string (e.g. "1601510400")
   * @param {string} endValue – UNIX‐seconds string (e.g. "1604188799")
   */
  async function fetchItems(startValue, endValue) {
    fetchError.value = ''
    items.value = []
    itemsFetched.value = false

    try {
      // 1) Get AWS credentials via Amplify Auth
      const credentials = await Auth.currentCredentials()

      // 2) Create DynamoDB client in us-east-2 with those credentials
      const client = new DynamoDBClient({
        region: 'us-east-2',
        credentials: Auth.essentialCredentials(credentials),
      })

      // 3) Get Cognito username for the partition key
      const currentUser = await Auth.currentAuthenticatedUser()
      const username = currentUser.username

      // 4) Build and send the QueryCommand with dynamic date range
      const queryParams = {
        TableName: 'postData',
        KeyConditionExpression:
          'customerName = :customerName AND uStopTime BETWEEN :start AND :end',
        ExpressionAttributeValues: {
          ':customerName': { S: username },
          ':start': { S: startValue },
          ':end': { S: endValue },
        },
      }
      const command = new QueryCommand(queryParams)
      const response = await client.send(command)

      // 5) Unmarshall items returned by DynamoDB
      items.value = response.Items
        ? response.Items.map((i) => unmarshall(i))
        : []
      itemsFetched.value = true
    } catch (err) {
      console.error('DynamoDB query error:', err)
      fetchError.value = err.message || JSON.stringify(err)
      itemsFetched.value = true
    }
  }

  return {
    items,
    itemsFetched,
    fetchError,
    fetchItems,
  }
}
