import { View, Text, FlatList, StyleSheet, Button } from 'react-native'
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { ContestData } from '@/types'
import { useCalander } from '@/hooks/useCalander'

export default function ContestsScreen() {
  const [contests, setContests] = useState<{
    upcoming: ContestData[]
    completed: ContestData[]
  }>({ upcoming: [], completed: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)
  const { createCalendarEvent } = useCalander()
  const loadContests = async () => {
    setLoading(true)
    try {
      // Logic to fetch contest info from Codeforces API
      const response = await axios.get(
        'https://codeforces.com/api/contest.list'
      )
      setContests({
        upcoming: response.data.result.filter(
          (contest: ContestData) =>
            contest.startTimeSeconds * 1000 >= Date.now()
        ),
        completed: response.data.result.filter(
          (contest: ContestData) => contest.startTimeSeconds * 1000 < Date.now()
        ),
      })
      setError(null)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setError(error)
      setLoading(false)
    }
  }

  const renderContestCard = useCallback(
    ({ item: contest, index }: { item: ContestData; index: number }) => (
      <View key={index} style={[styles.cardContainer]}>
        <Text style={styles.cardHeading}>{contest.name}</Text>
        <Text style={styles.cardSubHeading}>
          {new Date(contest.startTimeSeconds * 1000).toLocaleString()}
        </Text>
        {Date.now() <= contest.startTimeSeconds * 1000 ? (
          <View style={styles.addToCalanderButton}>
            <Button
              title="Add to Calander"
              onPress={() => addToCalander(contest)}
            />
          </View>
        ) : null}
      </View>
    ),
    []
  )

  const addToCalander = (contest: ContestData) => {
    console.log(JSON.stringify(contest))
    createCalendarEvent({
      name: contest.name,
      startTimeSeconds: contest.startTimeSeconds,
      durationInMinutes: Math.floor(contest.duration / 60),
      description: `Contest link: https://codeforces.com/contests/${contest.id}`,
    })
  }

  useEffect(() => {
    loadContests()
  }, [])

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error?.toString()}</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={[
        ...contests.upcoming.sort(
          (a: ContestData, b: ContestData) =>
            a.startTimeSeconds - b.startTimeSeconds
        ),
        ...contests.completed,
      ]}
      keyExtractor={(item: { id: number }) => `${item.id}`}
      renderItem={renderContestCard}
      refreshing={loading}
      onRefresh={loadContests}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    margin: 10,
    padding: 10,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cardHeading: {},
  cardSubHeading: {
    marginVertical: 5,
  },
  addToCalanderButton: {
    marginTop: 10,
  },
})
