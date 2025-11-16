import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import useAuthStore from '../user/store'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [registerData, setRegisterData] = useState({
    name: '',
    username: '',
    password: '',
  })
  const navigate = useNavigate()
  const { isLoading, isSuccess, register } = useAuthStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value

    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleClick = () => {
    register(registerData)
  }

  useEffect(() => {
    if (!isLoading && isSuccess) {
      navigate('/login')
    }
  }, [isLoading, isSuccess])

  return (
    <div className="w-full flex justify-center items-center h-full">
      <Card className="w-md h-fit">
        <CardHeader>Register</CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            onChange={handleChange}
            placeholder="Username"
            type="text"
            value={registerData.username}
          />
        </CardContent>
        <CardContent className="flex flex-col gap-2">
          <Label htmlFor="name">Nama</Label>
          <Input
            id="name"
            name="name"
            onChange={handleChange}
            placeholder="Nama"
            type="input"
            value={registerData.name}
          />
        </CardContent>
        <CardContent className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            onChange={handleChange}
            placeholder="Password"
            type="password"
            value={registerData.password}
          />
        </CardContent>
        <CardContent>
          <Button
            className="cursor-pointer w-full hover:bg-slate-500 hover:text-white"
            isLoading={isLoading}
            onClick={handleClick}
          >
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export { Register }
