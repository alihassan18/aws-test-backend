import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: 'schema.gql',
            playground: false,
            introspection:false
            // transformSchema: (schema:any) => upperDirectiveTransformer(schema, 'upper'),
            // installSubscriptionHandlers: true,
            // buildSchemaOptions: {
            //   directives: [
            //     new GraphQLDirective({
            //       name: 'upper',
            //       locations: [DirectiveLocation.FIELD_DEFINITION],
            //     }),
            //   ],
            // },
            // autoSchemaFile: true,
            // typePaths: ['./**/*.graphql'],
            // definitions: {
            //   path: join(process.cwd(), 'src/graphql.ts'),
            //   outputAs: 'class',
            // },
        })
        // GraphQLModule.forRoot({
        //   autoSchemaFile: './schema.gql',
        //   debug: true,
        //   playground: true,
        // }),
    ]
})
export class GraphqlModule {}
