import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from 'rollup-plugin-replace';
import babel from 'rollup-plugin-babel';
import {uglify} from 'rollup-plugin-uglify';
import json from '@rollup/plugin-json';
import clean from 'rollup-plugin-clean';
const env = process.env.NODE_ENV;
export default [
	{
        input: './src/index.js',
		output: [
            { file: pkg.dist.prod.umd, format: 'umd', name: pkg.dist.prod.name, sourcemap: env === 'production' ? true : false }, 
            // env === 'production' && { file: pkg.dist.prod.cjs, format: 'cjs', sourcemap: true},
            // cannot uglify
            // env === 'production' && { file: pkg.dist.prod.es, format: 'esm', exports: 'named', sourcemap: true }
        ],
        // why cannot use?
        // banner: 'var ENVIRONMENT = "production";',
        // cache: true,
        // sourcemap: true,

        plugins: [
            clean({dest: 'dist'}),
            commonjs({ignore:['conditional-runtime-dependency']}),
            
            resolve({
            // 将自定义选项传递给解析插件
            customResolveOptions: {
            }
            }),
            babel({
                exclude: "node_modules/**",
                // externalHelpers: env === 'production',
                
            }),
            replace({
                'process.env.NODE_ENV': JSON.stringify(env),
                '__VERSION__': pkg.version
            }),
            process.env.NODE_ENV !== 'development' && uglify(), 
            json()

        ],
        
    }
];