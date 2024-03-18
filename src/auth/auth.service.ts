import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RegisterDto } from './dto/auth.dto';
import { User } from '@prisma/client';
import {hash ,compare} from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class AuthService {
    constructor(private prismaService:PrismaService,
        private jwtService:JwtService){

    }
    register = async (userData:RegisterDto):Promise<User>=>{
        const user = await this.prismaService.user.findUnique(
            {
                where:{
                    email:userData.email
                }
            }
        )
        if(user) {
            throw new HttpException({message:"this email has been use"},HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await hash(userData.password,10);
        const res =await this.prismaService.user.create({
            data:{...userData,password:hashPassword}
        })
        return res;
    }

    login   = async (data:{email:string,password:string}):Promise<any> =>{
        const user = await this.prismaService.user.findUnique({
            where:{
                email:data.email
            }
        })
        if(!user) {
            throw new HttpException({message:"user is not exist"},HttpStatus.UNAUTHORIZED)
        }
       const vetify   = await compare(data.password,user.password);
        if(!vetify) {
            throw new HttpException({message:"passworl dose not correct"},HttpStatus.UNAUTHORIZED)
        }
        const payload = {
            id:user.id,
            email:user.email
        }
        const acesstoken = await this.jwtService.signAsync(payload,{
            secret:"hhhhhh",
            expiresIn:'1h'
        })
        const refreshToken = await this.jwtService.signAsync(payload,{
            secret:"etertf",
            expiresIn:"7d"
        })
        return {
            acesstoken,
            refreshToken
        }

    }
}
