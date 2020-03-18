import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from 'rollup-plugin-replace';
import babel from 'rollup-plugin-babel';
import {uglify} from 'rollup-plugin-uglify';
// import json from '@rollup/plugin-json';
const env = process.env.NODE_ENV;
export default [


	{
        input: './src/index.js',
		output: [
            { file: pkg.dist.prod.dir, format: 'umd', name: pkg.dist.prod.name }
        ],
        // why cannot use?
        // banner: 'var ENVIRONMENT = "production";',
        // cache: true,
        // sourcemap: true,

        plugins: [
            commonjs({ignore:['conditional-runtime-dependency']}),
            
            resolve({
            // 将自定义选项传递给解析插件
            customResolveOptions: {
            }
            }),
            babel({
                exclude: "node_modules/**"
            }),
            replace({
                'process.env.NODE_ENV': JSON.stringify(env)
            }),
            uglify(),
            // json()

        ],
        
    }
];