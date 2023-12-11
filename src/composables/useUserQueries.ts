import { type Ref, ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

export interface Person {
  age: number
  firstName: string
  lastName: string
  progress: number
  status: string
  visits: number
}

const defaultData: Person[] = [
  {
    firstName: 'John',
    lastName: 'Doe',
    age: 25,
    visits: 10,
    status: 'Active',
    progress: 0.8,
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    age: 32,
    visits: 15,
    status: 'Inactive',
    progress: 0.5,
  },
  {
    firstName: 'Michael',
    lastName: 'Johnson',
    age: 41,
    visits: 5,
    status: 'Active',
    progress: 0.9,
  },
  {
    firstName: 'Emily',
    lastName: 'Brown',
    age: 29,
    visits: 20,
    status: 'Inactive',
    progress: 0.3,
  },
  {
    firstName: 'David',
    lastName: 'Wilson',
    age: 37,
    visits: 8,
    status: 'Active',
    progress: 0.6,
  },
  {
    firstName: 'Sarah',
    lastName: 'Taylor',
    age: 44,
    visits: 12,
    status: 'Inactive',
    progress: 0.7,
  },
  {
    firstName: 'Daniel',
    lastName: 'Anderson',
    age: 36,
    visits: 18,
    status: 'Active',
    progress: 0.4,
  },
  {
    firstName: 'Olivia',
    lastName: 'Martinez',
    age: 31,
    visits: 7,
    status: 'Inactive',
    progress: 0.2,
  },
  {
    firstName: 'Matthew',
    lastName: 'Hernandez',
    age: 27,
    visits: 13,
    status: 'Active',
    progress: 0.8,
  },
  {
    firstName: 'Sophia',
    lastName: 'Garcia',
    age: 39,
    visits: 9,
    status: 'Inactive',
    progress: 0.5,
  },
]

export default function useUserQueries() {
  function getUsers(enabled: Ref<boolean> = ref(true)) {
    return useQuery({
      queryKey: ['users'],
      enabled,
      queryFn: (): Promise<Person[]> => new Promise((resolve) => {
        setTimeout(() => {
          resolve(defaultData)
        }, 1)
      }),
      //  select: res => res.data,
      refetchOnWindowFocus: false,
    })
  }

  return {
    getUsers,
  }
}
