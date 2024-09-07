import { Brand, Constructor, IntersectWithBase, Prettify, ValueType } from '../../utilityTypes';
import { nanoid } from 'nanoid';
import mitt, { Emitter, WildcardHandler } from 'mitt';

export const MFMEventMap = {
	Load: 'load',
	Import: 'import',
} as const;

export type MFMEventType = ValueType<typeof MFMEventMap>;

export const MFMEventStateMap = {
	Start: 'start',
	Success: 'success',
	Error: 'error',
} as const;

export type MFMEventState = ValueType<typeof MFMEventStateMap>;

export type MFMEventTypes = IntersectWithBase<
	{ scopeName: string },
	{
		load: { url: string };
		import: { moduleName: string };
		error: { error: Error };
	}
>;

export type MFMEventPayloadMap = {
	load: {
		start: MFMEventTypes['load'];
		success: MFMEventTypes['load'];
		error: MFMEventTypes['error'];
	};
	import: {
		start: MFMEventTypes['import'];
		success: MFMEventTypes['import'];
		error: MFMEventTypes['error'];
	};
};

export type MFMEventId = Brand<string, 'MFMEventId'>;

export type MFMInferEventType<T extends MFMEventType, S extends MFMEventState> = `${T}_${S}`;

type ValidMFMEventState<T extends MFMEventType, S> = S extends keyof MFMEventPayloadMap[T] ? S : never;

export type MFMEvent<T extends MFMEventType, S extends MFMEventState> = {
	id: MFMEventId;
	type: MFMInferEventType<T, S>;
	payload: S extends ValidMFMEventState<T, S> ? MFMEventPayloadMap[T][S] : never;
};

function createEventId() {
	return nanoid() as MFMEventId;
}

export function createEventType<T extends MFMEventType, S extends MFMEventState>(type: T, state: S) {
	return `${type}_${state}` as MFMInferEventType<T, S>;
}

export type AllMFMEvents = Prettify<MFMEvent<MFMEventType, MFMEventState>>;

export function createEvent<T extends MFMEventType, S extends MFMEventState>(
	type: T,
	state: S,
	payload: S extends ValidMFMEventState<T, S> ? MFMEventPayloadMap[T][S] : never,
): MFMEvent<T, S> {
	return Object.freeze({
		id: createEventId(),
		type: createEventType(type, state),
		payload,
	});
}

export interface IEventEmitterMixin<T extends AllMFMEvents = AllMFMEvents> {
	on<T extends MFMEventType, S extends MFMEventState>(
		type: T,
		state: S,
		handler: (event: MFMEventPayloadMap[T][S]) => void,
	): void;

	off<T extends MFMEventType, S extends MFMEventState>(
		type: T,
		state: S,
		handler?: (event: MFMEventPayloadMap[T][S]) => void,
	): void;

	emit<T extends MFMEventType, S extends MFMEventState>(event: MFMEvent<T, S>): void;
	onAny<K extends keyof T>(handler: (type: T, event: T[K]) => void): void;
	offAny<K extends keyof T>(handler: (type: T, event: T[K]) => void): void;
}

export function EventEmitterMixin<TBase extends Constructor>(Base: TBase) {
	return class extends Base implements IEventEmitterMixin<any> {
		emitter: Emitter<Record<string, unknown>>;

		constructor(...args: any[]) {
			super(...args);
			this.emitter = mitt<Record<string, unknown>>();
		}

		on<T extends MFMEventType, S extends MFMEventState>(
			type: T,
			state: S,
			handler: (event: S extends ValidMFMEventState<T, S> ? MFMEventPayloadMap[T][S] : never) => void,
		) {
			this.emitter.on(createEventType(type, state), handler);
		}

		off<T extends MFMEventType, S extends MFMEventState>(
			type: T,
			state: S,
			handler?: (event: S extends ValidMFMEventState<T, S> ? MFMEventPayloadMap[T][S] : never) => void,
		) {
			this.emitter.off(createEventType(type, state) as keyof MFMEvent<MFMEventType, MFMEventState>, handler);
		}

		onAny<K extends keyof AllMFMEvents>(handler: (type: keyof AllMFMEvents, event: keyof AllMFMEvents[K]) => void) {
			this.emitter.on('*', handler as unknown as WildcardHandler);
		}

		offAny<K extends keyof AllMFMEvents>(handler: (type: AllMFMEvents, event: AllMFMEvents[K]) => void) {
			this.emitter.on('*', handler as unknown as WildcardHandler);
		}

		emit<T extends MFMEventType, S extends MFMEventState>(event: MFMEvent<T, S>) {
			this.emitter.emit(event.type, event.payload);
		}
	};
}
