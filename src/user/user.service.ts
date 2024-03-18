import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto, UpdateUserDto, UserFilterType, UserPaginationResponseType } from './dto/user.dto';
import { User } from '@prisma/client';
import { hash } from 'bcrypt'
@Injectable()
export class UserService {
    constructor(private prismaService:PrismaService){}
    create = async (body:CreateUserDto):Promise<User>=>{
        const user = await this.prismaService.user.findUnique({
            where:{
                email:body.email
            }
        })
        if(user) {
            throw  new HttpException({message:"email is already"},HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await hash(body.password,10);
        const result = await this.prismaService.user.create({
            data:{
                ...body,password:hashPassword
            }
        })
        return result;

    }

      getAll = async (filters:UserFilterType):Promise<UserPaginationResponseType> =>{
        const items_per_page = Number(filters.items_per_page) || 10
        const page = Number(filters.page) || 1
        const search = filters.search || ''
        const skip = page > 1 ? (page - 1) * items_per_page : 0
        const users = await this.prismaService.user.findMany({
            take: items_per_page,
            skip,
            where: {
                OR: [
                    {
                        name: {
                            contains: search
                        }
                    },
                    {
                        email: {
                            contains: search
                        }
                    }
                ],
                AND: [
                    {
                        status: 1
                    }
                ]
            },
            orderBy: {
                createAt: 'desc'
            }
        })

        const total = await this.prismaService.user.count({
            where:{
                OR: [
                    {
                        name: {
                            contains: search
                        }
                    },
                    {
                        email: {
                            contains: search
                        }
                    }
                ],
                AND: [
                    {
                        status: 2
                    }
                ]
            }
        })
        return {
            data:users,
            total,
            currentPage:page,
            itemsPerPage:items_per_page
        }
    }
    async getDetail(id: number): Promise<User> {
        return this.prismaService.user.findFirst({
            where: {
                id
            }
        })
    }

    async update(id: number, data: UpdateUserDto): Promise<User> {
        return await this.prismaService.user.update({
            where: {
                id
            },
            data
        })
    }

}
