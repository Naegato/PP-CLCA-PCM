import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model AdvisorProps
 *
 */
export type AdvisorPropsModel = runtime.Types.Result.DefaultSelection<Prisma.$AdvisorPropsPayload>;
export type AggregateAdvisorProps = {
    _count: AdvisorPropsCountAggregateOutputType | null;
    _min: AdvisorPropsMinAggregateOutputType | null;
    _max: AdvisorPropsMaxAggregateOutputType | null;
};
export type AdvisorPropsMinAggregateOutputType = {
    identifier: string | null;
    userId: string | null;
};
export type AdvisorPropsMaxAggregateOutputType = {
    identifier: string | null;
    userId: string | null;
};
export type AdvisorPropsCountAggregateOutputType = {
    identifier: number;
    userId: number;
    _all: number;
};
export type AdvisorPropsMinAggregateInputType = {
    identifier?: true;
    userId?: true;
};
export type AdvisorPropsMaxAggregateInputType = {
    identifier?: true;
    userId?: true;
};
export type AdvisorPropsCountAggregateInputType = {
    identifier?: true;
    userId?: true;
    _all?: true;
};
export type AdvisorPropsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which AdvisorProps to aggregate.
     */
    where?: Prisma.AdvisorPropsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AdvisorProps to fetch.
     */
    orderBy?: Prisma.AdvisorPropsOrderByWithRelationInput | Prisma.AdvisorPropsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.AdvisorPropsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AdvisorProps from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AdvisorProps.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned AdvisorProps
    **/
    _count?: true | AdvisorPropsCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: AdvisorPropsMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: AdvisorPropsMaxAggregateInputType;
};
export type GetAdvisorPropsAggregateType<T extends AdvisorPropsAggregateArgs> = {
    [P in keyof T & keyof AggregateAdvisorProps]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateAdvisorProps[P]> : Prisma.GetScalarType<T[P], AggregateAdvisorProps[P]>;
};
export type AdvisorPropsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AdvisorPropsWhereInput;
    orderBy?: Prisma.AdvisorPropsOrderByWithAggregationInput | Prisma.AdvisorPropsOrderByWithAggregationInput[];
    by: Prisma.AdvisorPropsScalarFieldEnum[] | Prisma.AdvisorPropsScalarFieldEnum;
    having?: Prisma.AdvisorPropsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AdvisorPropsCountAggregateInputType | true;
    _min?: AdvisorPropsMinAggregateInputType;
    _max?: AdvisorPropsMaxAggregateInputType;
};
export type AdvisorPropsGroupByOutputType = {
    identifier: string;
    userId: string;
    _count: AdvisorPropsCountAggregateOutputType | null;
    _min: AdvisorPropsMinAggregateOutputType | null;
    _max: AdvisorPropsMaxAggregateOutputType | null;
};
type GetAdvisorPropsGroupByPayload<T extends AdvisorPropsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<AdvisorPropsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof AdvisorPropsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], AdvisorPropsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], AdvisorPropsGroupByOutputType[P]>;
}>>;
export type AdvisorPropsWhereInput = {
    AND?: Prisma.AdvisorPropsWhereInput | Prisma.AdvisorPropsWhereInput[];
    OR?: Prisma.AdvisorPropsWhereInput[];
    NOT?: Prisma.AdvisorPropsWhereInput | Prisma.AdvisorPropsWhereInput[];
    identifier?: Prisma.StringFilter<"AdvisorProps"> | string;
    userId?: Prisma.StringFilter<"AdvisorProps"> | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type AdvisorPropsOrderByWithRelationInput = {
    identifier?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type AdvisorPropsWhereUniqueInput = Prisma.AtLeast<{
    identifier?: string;
    userId?: string;
    AND?: Prisma.AdvisorPropsWhereInput | Prisma.AdvisorPropsWhereInput[];
    OR?: Prisma.AdvisorPropsWhereInput[];
    NOT?: Prisma.AdvisorPropsWhereInput | Prisma.AdvisorPropsWhereInput[];
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "identifier" | "userId">;
export type AdvisorPropsOrderByWithAggregationInput = {
    identifier?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    _count?: Prisma.AdvisorPropsCountOrderByAggregateInput;
    _max?: Prisma.AdvisorPropsMaxOrderByAggregateInput;
    _min?: Prisma.AdvisorPropsMinOrderByAggregateInput;
};
export type AdvisorPropsScalarWhereWithAggregatesInput = {
    AND?: Prisma.AdvisorPropsScalarWhereWithAggregatesInput | Prisma.AdvisorPropsScalarWhereWithAggregatesInput[];
    OR?: Prisma.AdvisorPropsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.AdvisorPropsScalarWhereWithAggregatesInput | Prisma.AdvisorPropsScalarWhereWithAggregatesInput[];
    identifier?: Prisma.StringWithAggregatesFilter<"AdvisorProps"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"AdvisorProps"> | string;
};
export type AdvisorPropsCreateInput = {
    identifier?: string;
    user: Prisma.UserCreateNestedOneWithoutAdvisorPropsInput;
};
export type AdvisorPropsUncheckedCreateInput = {
    identifier?: string;
    userId: string;
};
export type AdvisorPropsUpdateInput = {
    identifier?: Prisma.StringFieldUpdateOperationsInput | string;
    user?: Prisma.UserUpdateOneRequiredWithoutAdvisorPropsNestedInput;
};
export type AdvisorPropsUncheckedUpdateInput = {
    identifier?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type AdvisorPropsCreateManyInput = {
    identifier?: string;
    userId: string;
};
export type AdvisorPropsUpdateManyMutationInput = {
    identifier?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type AdvisorPropsUncheckedUpdateManyInput = {
    identifier?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type AdvisorPropsNullableScalarRelationFilter = {
    is?: Prisma.AdvisorPropsWhereInput | null;
    isNot?: Prisma.AdvisorPropsWhereInput | null;
};
export type AdvisorPropsCountOrderByAggregateInput = {
    identifier?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type AdvisorPropsMaxOrderByAggregateInput = {
    identifier?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type AdvisorPropsMinOrderByAggregateInput = {
    identifier?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type AdvisorPropsCreateNestedOneWithoutUserInput = {
    create?: Prisma.XOR<Prisma.AdvisorPropsCreateWithoutUserInput, Prisma.AdvisorPropsUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.AdvisorPropsCreateOrConnectWithoutUserInput;
    connect?: Prisma.AdvisorPropsWhereUniqueInput;
};
export type AdvisorPropsUncheckedCreateNestedOneWithoutUserInput = {
    create?: Prisma.XOR<Prisma.AdvisorPropsCreateWithoutUserInput, Prisma.AdvisorPropsUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.AdvisorPropsCreateOrConnectWithoutUserInput;
    connect?: Prisma.AdvisorPropsWhereUniqueInput;
};
export type AdvisorPropsUpdateOneWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.AdvisorPropsCreateWithoutUserInput, Prisma.AdvisorPropsUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.AdvisorPropsCreateOrConnectWithoutUserInput;
    upsert?: Prisma.AdvisorPropsUpsertWithoutUserInput;
    disconnect?: Prisma.AdvisorPropsWhereInput | boolean;
    delete?: Prisma.AdvisorPropsWhereInput | boolean;
    connect?: Prisma.AdvisorPropsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.AdvisorPropsUpdateToOneWithWhereWithoutUserInput, Prisma.AdvisorPropsUpdateWithoutUserInput>, Prisma.AdvisorPropsUncheckedUpdateWithoutUserInput>;
};
export type AdvisorPropsUncheckedUpdateOneWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.AdvisorPropsCreateWithoutUserInput, Prisma.AdvisorPropsUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.AdvisorPropsCreateOrConnectWithoutUserInput;
    upsert?: Prisma.AdvisorPropsUpsertWithoutUserInput;
    disconnect?: Prisma.AdvisorPropsWhereInput | boolean;
    delete?: Prisma.AdvisorPropsWhereInput | boolean;
    connect?: Prisma.AdvisorPropsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.AdvisorPropsUpdateToOneWithWhereWithoutUserInput, Prisma.AdvisorPropsUpdateWithoutUserInput>, Prisma.AdvisorPropsUncheckedUpdateWithoutUserInput>;
};
export type AdvisorPropsCreateWithoutUserInput = {
    identifier?: string;
};
export type AdvisorPropsUncheckedCreateWithoutUserInput = {
    identifier?: string;
};
export type AdvisorPropsCreateOrConnectWithoutUserInput = {
    where: Prisma.AdvisorPropsWhereUniqueInput;
    create: Prisma.XOR<Prisma.AdvisorPropsCreateWithoutUserInput, Prisma.AdvisorPropsUncheckedCreateWithoutUserInput>;
};
export type AdvisorPropsUpsertWithoutUserInput = {
    update: Prisma.XOR<Prisma.AdvisorPropsUpdateWithoutUserInput, Prisma.AdvisorPropsUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.AdvisorPropsCreateWithoutUserInput, Prisma.AdvisorPropsUncheckedCreateWithoutUserInput>;
    where?: Prisma.AdvisorPropsWhereInput;
};
export type AdvisorPropsUpdateToOneWithWhereWithoutUserInput = {
    where?: Prisma.AdvisorPropsWhereInput;
    data: Prisma.XOR<Prisma.AdvisorPropsUpdateWithoutUserInput, Prisma.AdvisorPropsUncheckedUpdateWithoutUserInput>;
};
export type AdvisorPropsUpdateWithoutUserInput = {
    identifier?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type AdvisorPropsUncheckedUpdateWithoutUserInput = {
    identifier?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type AdvisorPropsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    identifier?: boolean;
    userId?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["advisorProps"]>;
export type AdvisorPropsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    identifier?: boolean;
    userId?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["advisorProps"]>;
export type AdvisorPropsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    identifier?: boolean;
    userId?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["advisorProps"]>;
export type AdvisorPropsSelectScalar = {
    identifier?: boolean;
    userId?: boolean;
};
export type AdvisorPropsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"identifier" | "userId", ExtArgs["result"]["advisorProps"]>;
export type AdvisorPropsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type AdvisorPropsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type AdvisorPropsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $AdvisorPropsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "AdvisorProps";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        identifier: string;
        userId: string;
    }, ExtArgs["result"]["advisorProps"]>;
    composites: {};
};
export type AdvisorPropsGetPayload<S extends boolean | null | undefined | AdvisorPropsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$AdvisorPropsPayload, S>;
export type AdvisorPropsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<AdvisorPropsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AdvisorPropsCountAggregateInputType | true;
};
export interface AdvisorPropsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['AdvisorProps'];
        meta: {
            name: 'AdvisorProps';
        };
    };
    /**
     * Find zero or one AdvisorProps that matches the filter.
     * @param {AdvisorPropsFindUniqueArgs} args - Arguments to find a AdvisorProps
     * @example
     * // Get one AdvisorProps
     * const advisorProps = await prisma.advisorProps.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdvisorPropsFindUniqueArgs>(args: Prisma.SelectSubset<T, AdvisorPropsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__AdvisorPropsClient<runtime.Types.Result.GetResult<Prisma.$AdvisorPropsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one AdvisorProps that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AdvisorPropsFindUniqueOrThrowArgs} args - Arguments to find a AdvisorProps
     * @example
     * // Get one AdvisorProps
     * const advisorProps = await prisma.advisorProps.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdvisorPropsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, AdvisorPropsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__AdvisorPropsClient<runtime.Types.Result.GetResult<Prisma.$AdvisorPropsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first AdvisorProps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdvisorPropsFindFirstArgs} args - Arguments to find a AdvisorProps
     * @example
     * // Get one AdvisorProps
     * const advisorProps = await prisma.advisorProps.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdvisorPropsFindFirstArgs>(args?: Prisma.SelectSubset<T, AdvisorPropsFindFirstArgs<ExtArgs>>): Prisma.Prisma__AdvisorPropsClient<runtime.Types.Result.GetResult<Prisma.$AdvisorPropsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first AdvisorProps that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdvisorPropsFindFirstOrThrowArgs} args - Arguments to find a AdvisorProps
     * @example
     * // Get one AdvisorProps
     * const advisorProps = await prisma.advisorProps.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdvisorPropsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, AdvisorPropsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__AdvisorPropsClient<runtime.Types.Result.GetResult<Prisma.$AdvisorPropsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more AdvisorProps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdvisorPropsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AdvisorProps
     * const advisorProps = await prisma.advisorProps.findMany()
     *
     * // Get first 10 AdvisorProps
     * const advisorProps = await prisma.advisorProps.findMany({ take: 10 })
     *
     * // Only select the `identifier`
     * const advisorPropsWithIdentifierOnly = await prisma.advisorProps.findMany({ select: { identifier: true } })
     *
     */
    findMany<T extends AdvisorPropsFindManyArgs>(args?: Prisma.SelectSubset<T, AdvisorPropsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AdvisorPropsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a AdvisorProps.
     * @param {AdvisorPropsCreateArgs} args - Arguments to create a AdvisorProps.
     * @example
     * // Create one AdvisorProps
     * const AdvisorProps = await prisma.advisorProps.create({
     *   data: {
     *     // ... data to create a AdvisorProps
     *   }
     * })
     *
     */
    create<T extends AdvisorPropsCreateArgs>(args: Prisma.SelectSubset<T, AdvisorPropsCreateArgs<ExtArgs>>): Prisma.Prisma__AdvisorPropsClient<runtime.Types.Result.GetResult<Prisma.$AdvisorPropsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many AdvisorProps.
     * @param {AdvisorPropsCreateManyArgs} args - Arguments to create many AdvisorProps.
     * @example
     * // Create many AdvisorProps
     * const advisorProps = await prisma.advisorProps.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AdvisorPropsCreateManyArgs>(args?: Prisma.SelectSubset<T, AdvisorPropsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many AdvisorProps and returns the data saved in the database.
     * @param {AdvisorPropsCreateManyAndReturnArgs} args - Arguments to create many AdvisorProps.
     * @example
     * // Create many AdvisorProps
     * const advisorProps = await prisma.advisorProps.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many AdvisorProps and only return the `identifier`
     * const advisorPropsWithIdentifierOnly = await prisma.advisorProps.createManyAndReturn({
     *   select: { identifier: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends AdvisorPropsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, AdvisorPropsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AdvisorPropsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a AdvisorProps.
     * @param {AdvisorPropsDeleteArgs} args - Arguments to delete one AdvisorProps.
     * @example
     * // Delete one AdvisorProps
     * const AdvisorProps = await prisma.advisorProps.delete({
     *   where: {
     *     // ... filter to delete one AdvisorProps
     *   }
     * })
     *
     */
    delete<T extends AdvisorPropsDeleteArgs>(args: Prisma.SelectSubset<T, AdvisorPropsDeleteArgs<ExtArgs>>): Prisma.Prisma__AdvisorPropsClient<runtime.Types.Result.GetResult<Prisma.$AdvisorPropsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one AdvisorProps.
     * @param {AdvisorPropsUpdateArgs} args - Arguments to update one AdvisorProps.
     * @example
     * // Update one AdvisorProps
     * const advisorProps = await prisma.advisorProps.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AdvisorPropsUpdateArgs>(args: Prisma.SelectSubset<T, AdvisorPropsUpdateArgs<ExtArgs>>): Prisma.Prisma__AdvisorPropsClient<runtime.Types.Result.GetResult<Prisma.$AdvisorPropsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more AdvisorProps.
     * @param {AdvisorPropsDeleteManyArgs} args - Arguments to filter AdvisorProps to delete.
     * @example
     * // Delete a few AdvisorProps
     * const { count } = await prisma.advisorProps.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AdvisorPropsDeleteManyArgs>(args?: Prisma.SelectSubset<T, AdvisorPropsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more AdvisorProps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdvisorPropsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AdvisorProps
     * const advisorProps = await prisma.advisorProps.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AdvisorPropsUpdateManyArgs>(args: Prisma.SelectSubset<T, AdvisorPropsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more AdvisorProps and returns the data updated in the database.
     * @param {AdvisorPropsUpdateManyAndReturnArgs} args - Arguments to update many AdvisorProps.
     * @example
     * // Update many AdvisorProps
     * const advisorProps = await prisma.advisorProps.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more AdvisorProps and only return the `identifier`
     * const advisorPropsWithIdentifierOnly = await prisma.advisorProps.updateManyAndReturn({
     *   select: { identifier: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends AdvisorPropsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, AdvisorPropsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AdvisorPropsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one AdvisorProps.
     * @param {AdvisorPropsUpsertArgs} args - Arguments to update or create a AdvisorProps.
     * @example
     * // Update or create a AdvisorProps
     * const advisorProps = await prisma.advisorProps.upsert({
     *   create: {
     *     // ... data to create a AdvisorProps
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AdvisorProps we want to update
     *   }
     * })
     */
    upsert<T extends AdvisorPropsUpsertArgs>(args: Prisma.SelectSubset<T, AdvisorPropsUpsertArgs<ExtArgs>>): Prisma.Prisma__AdvisorPropsClient<runtime.Types.Result.GetResult<Prisma.$AdvisorPropsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of AdvisorProps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdvisorPropsCountArgs} args - Arguments to filter AdvisorProps to count.
     * @example
     * // Count the number of AdvisorProps
     * const count = await prisma.advisorProps.count({
     *   where: {
     *     // ... the filter for the AdvisorProps we want to count
     *   }
     * })
    **/
    count<T extends AdvisorPropsCountArgs>(args?: Prisma.Subset<T, AdvisorPropsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], AdvisorPropsCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a AdvisorProps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdvisorPropsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AdvisorPropsAggregateArgs>(args: Prisma.Subset<T, AdvisorPropsAggregateArgs>): Prisma.PrismaPromise<GetAdvisorPropsAggregateType<T>>;
    /**
     * Group by AdvisorProps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdvisorPropsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends AdvisorPropsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: AdvisorPropsGroupByArgs['orderBy'];
    } : {
        orderBy?: AdvisorPropsGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, AdvisorPropsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdvisorPropsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the AdvisorProps model
     */
    readonly fields: AdvisorPropsFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for AdvisorProps.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__AdvisorPropsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the AdvisorProps model
 */
export interface AdvisorPropsFieldRefs {
    readonly identifier: Prisma.FieldRef<"AdvisorProps", 'String'>;
    readonly userId: Prisma.FieldRef<"AdvisorProps", 'String'>;
}
/**
 * AdvisorProps findUnique
 */
export type AdvisorPropsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdvisorProps
     */
    select?: Prisma.AdvisorPropsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AdvisorProps
     */
    omit?: Prisma.AdvisorPropsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AdvisorPropsInclude<ExtArgs> | null;
    /**
     * Filter, which AdvisorProps to fetch.
     */
    where: Prisma.AdvisorPropsWhereUniqueInput;
};
/**
 * AdvisorProps findUniqueOrThrow
 */
export type AdvisorPropsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdvisorProps
     */
    select?: Prisma.AdvisorPropsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AdvisorProps
     */
    omit?: Prisma.AdvisorPropsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AdvisorPropsInclude<ExtArgs> | null;
    /**
     * Filter, which AdvisorProps to fetch.
     */
    where: Prisma.AdvisorPropsWhereUniqueInput;
};
/**
 * AdvisorProps findFirst
 */
export type AdvisorPropsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdvisorProps
     */
    select?: Prisma.AdvisorPropsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AdvisorProps
     */
    omit?: Prisma.AdvisorPropsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AdvisorPropsInclude<ExtArgs> | null;
    /**
     * Filter, which AdvisorProps to fetch.
     */
    where?: Prisma.AdvisorPropsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AdvisorProps to fetch.
     */
    orderBy?: Prisma.AdvisorPropsOrderByWithRelationInput | Prisma.AdvisorPropsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AdvisorProps.
     */
    cursor?: Prisma.AdvisorPropsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AdvisorProps from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AdvisorProps.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AdvisorProps.
     */
    distinct?: Prisma.AdvisorPropsScalarFieldEnum | Prisma.AdvisorPropsScalarFieldEnum[];
};
/**
 * AdvisorProps findFirstOrThrow
 */
export type AdvisorPropsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdvisorProps
     */
    select?: Prisma.AdvisorPropsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AdvisorProps
     */
    omit?: Prisma.AdvisorPropsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AdvisorPropsInclude<ExtArgs> | null;
    /**
     * Filter, which AdvisorProps to fetch.
     */
    where?: Prisma.AdvisorPropsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AdvisorProps to fetch.
     */
    orderBy?: Prisma.AdvisorPropsOrderByWithRelationInput | Prisma.AdvisorPropsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AdvisorProps.
     */
    cursor?: Prisma.AdvisorPropsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AdvisorProps from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AdvisorProps.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AdvisorProps.
     */
    distinct?: Prisma.AdvisorPropsScalarFieldEnum | Prisma.AdvisorPropsScalarFieldEnum[];
};
/**
 * AdvisorProps findMany
 */
export type AdvisorPropsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdvisorProps
     */
    select?: Prisma.AdvisorPropsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AdvisorProps
     */
    omit?: Prisma.AdvisorPropsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AdvisorPropsInclude<ExtArgs> | null;
    /**
     * Filter, which AdvisorProps to fetch.
     */
    where?: Prisma.AdvisorPropsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AdvisorProps to fetch.
     */
    orderBy?: Prisma.AdvisorPropsOrderByWithRelationInput | Prisma.AdvisorPropsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing AdvisorProps.
     */
    cursor?: Prisma.AdvisorPropsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AdvisorProps from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AdvisorProps.
     */
    skip?: number;
    distinct?: Prisma.AdvisorPropsScalarFieldEnum | Prisma.AdvisorPropsScalarFieldEnum[];
};
/**
 * AdvisorProps create
 */
export type AdvisorPropsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdvisorProps
     */
    select?: Prisma.AdvisorPropsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AdvisorProps
     */
    omit?: Prisma.AdvisorPropsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AdvisorPropsInclude<ExtArgs> | null;
    /**
     * The data needed to create a AdvisorProps.
     */
    data: Prisma.XOR<Prisma.AdvisorPropsCreateInput, Prisma.AdvisorPropsUncheckedCreateInput>;
};
/**
 * AdvisorProps createMany
 */
export type AdvisorPropsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many AdvisorProps.
     */
    data: Prisma.AdvisorPropsCreateManyInput | Prisma.AdvisorPropsCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * AdvisorProps createManyAndReturn
 */
export type AdvisorPropsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdvisorProps
     */
    select?: Prisma.AdvisorPropsSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the AdvisorProps
     */
    omit?: Prisma.AdvisorPropsOmit<ExtArgs> | null;
    /**
     * The data used to create many AdvisorProps.
     */
    data: Prisma.AdvisorPropsCreateManyInput | Prisma.AdvisorPropsCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AdvisorPropsIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * AdvisorProps update
 */
export type AdvisorPropsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdvisorProps
     */
    select?: Prisma.AdvisorPropsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AdvisorProps
     */
    omit?: Prisma.AdvisorPropsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AdvisorPropsInclude<ExtArgs> | null;
    /**
     * The data needed to update a AdvisorProps.
     */
    data: Prisma.XOR<Prisma.AdvisorPropsUpdateInput, Prisma.AdvisorPropsUncheckedUpdateInput>;
    /**
     * Choose, which AdvisorProps to update.
     */
    where: Prisma.AdvisorPropsWhereUniqueInput;
};
/**
 * AdvisorProps updateMany
 */
export type AdvisorPropsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update AdvisorProps.
     */
    data: Prisma.XOR<Prisma.AdvisorPropsUpdateManyMutationInput, Prisma.AdvisorPropsUncheckedUpdateManyInput>;
    /**
     * Filter which AdvisorProps to update
     */
    where?: Prisma.AdvisorPropsWhereInput;
    /**
     * Limit how many AdvisorProps to update.
     */
    limit?: number;
};
/**
 * AdvisorProps updateManyAndReturn
 */
export type AdvisorPropsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdvisorProps
     */
    select?: Prisma.AdvisorPropsSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the AdvisorProps
     */
    omit?: Prisma.AdvisorPropsOmit<ExtArgs> | null;
    /**
     * The data used to update AdvisorProps.
     */
    data: Prisma.XOR<Prisma.AdvisorPropsUpdateManyMutationInput, Prisma.AdvisorPropsUncheckedUpdateManyInput>;
    /**
     * Filter which AdvisorProps to update
     */
    where?: Prisma.AdvisorPropsWhereInput;
    /**
     * Limit how many AdvisorProps to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AdvisorPropsIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * AdvisorProps upsert
 */
export type AdvisorPropsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdvisorProps
     */
    select?: Prisma.AdvisorPropsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AdvisorProps
     */
    omit?: Prisma.AdvisorPropsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AdvisorPropsInclude<ExtArgs> | null;
    /**
     * The filter to search for the AdvisorProps to update in case it exists.
     */
    where: Prisma.AdvisorPropsWhereUniqueInput;
    /**
     * In case the AdvisorProps found by the `where` argument doesn't exist, create a new AdvisorProps with this data.
     */
    create: Prisma.XOR<Prisma.AdvisorPropsCreateInput, Prisma.AdvisorPropsUncheckedCreateInput>;
    /**
     * In case the AdvisorProps was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.AdvisorPropsUpdateInput, Prisma.AdvisorPropsUncheckedUpdateInput>;
};
/**
 * AdvisorProps delete
 */
export type AdvisorPropsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdvisorProps
     */
    select?: Prisma.AdvisorPropsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AdvisorProps
     */
    omit?: Prisma.AdvisorPropsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AdvisorPropsInclude<ExtArgs> | null;
    /**
     * Filter which AdvisorProps to delete.
     */
    where: Prisma.AdvisorPropsWhereUniqueInput;
};
/**
 * AdvisorProps deleteMany
 */
export type AdvisorPropsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which AdvisorProps to delete
     */
    where?: Prisma.AdvisorPropsWhereInput;
    /**
     * Limit how many AdvisorProps to delete.
     */
    limit?: number;
};
/**
 * AdvisorProps without action
 */
export type AdvisorPropsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdvisorProps
     */
    select?: Prisma.AdvisorPropsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AdvisorProps
     */
    omit?: Prisma.AdvisorPropsOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AdvisorPropsInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=AdvisorProps.d.ts.map