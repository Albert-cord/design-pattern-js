
import "core-js/stable";
import "regenerator-runtime/runtime";
import {beforeFunction, afterFunction} from './Decorator';
import DutyChains from './DutyChains';
import FlyWeightManager from './FlyWeight';
import MediatorFactory from './Mediator';
import EventEmitter from './PublishSubscribe';
import Single from './Single';
import State from './State';

// export {beforeFunction};
// export {afterFunction};
// export {DutyChains};
// export {FlyWeightManager};
// export {MediatorFactory};
// export {EventEmitter as PublishSubscribe};
// export {EventEmitter};
// export {Single};
// export {State};

const DesignPattern = {
    beforeFunction,
    afterFunction,
    before: beforeFunction,
    after: afterFunction,
    DutyChains,
    FlyWeightManager,
    MediatorFactory: MediatorFactory,
    PublishSubscribe: EventEmitter,
    EventEmitter,
    Single,
    State,
    version: '__VERSION__'
}

 export default DesignPattern;
