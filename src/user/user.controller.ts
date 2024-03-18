import { Body, Controller, Post, Get, Query, ParseIntPipe, Param, Put } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserFilterType, UserPaginationResponseType } from './dto/user.dto';
import { UserService } from './user.service';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
    constructor(private userService:UserService){}
    @Post('register')
    create(@Body() user:CreateUserDto):Promise<User> {
        console.log(process.env.ACCESS_TOKEN_KEY);
         return this.userService.create(user);
    }
    @Get()
    getAll(@Query() param:UserFilterType):Promise<UserPaginationResponseType>  {
     return this.userService.getAll(param)   
    }
    @Get(':id')
    getDetail(@Param('id', ParseIntPipe) id: number): Promise<User> {
        console.log("get detail user api=> ", id)
        return this.userService.getDetail(id)
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateUserDto): Promise<User> {
        console.log("update user api=> ", id)
        return this.userService.update(id, data)
    }


}

