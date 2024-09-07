import { Brand, Constructor, IntersectWithBase, ValueType } from '../../utilityTypes';
import { nanoid } from 'nanoid';
import mitt, { Emitter, WildcardHandler } from 'mitt';

export const MFMEventMap = {
	Load: 'load',
	Import: 'import',
} as const;

export const MFMEventStateMap = {
	Start: 'start',
	Success: 'success',
	Error: 'error',
} as const;

export type EventType = ValueType<typeof MFMEventMap>;
export type EventState = ValueType<typeof MFMEventStateMap>;

type MFMEventTypes = IntersectWithBase<
	{ scopeName: string },
	{
		load: { url: string };
		import: { moduleName: string };
		error: { error: Error };
	}
>;

type MFMEventPayloadMap = {
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

type MFMEventId = Brand<string, 'MFMEventId'>;

type MFMInferEventType<T extends EventType, S extends EventState> = `${T}_${S}`;

type ValidMFMEventState<T extends EventType, S> = S extends keyof MFMEventPayloadMap[T] ? S : never;

export type MFMEvent<T extends EventType, S extends EventState> = {
	id: MFMEventId;
	type: MFMInferEventType<T, S>;
	payload: S extends ValidMFMEventState<T, S> ? MFMEventPayloadMap[T][S] : never;
};

function createEventId() {
	return nanoid() as MFMEventId;
}

export function createEventType<T extends EventType, S extends EventState>(type: T, state: S) {
	return `${type}_${state}` as MFMInferEventType<T, S>;
}

export type AllMFMEvents = MFMEvent<EventType, EventState>;

export function createEvent<T extends EventType, S extends EventState>(
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
	on<T extends EventType, S extends EventState>(
		type: T,
		state: S,
		handler: (event: MFMEventPayloadMap[T][S]) => void,
	): void;

	off<T extends EventType, S extends EventState>(
		type: T,
		state: S,
		handler?: (event: MFMEventPayloadMap[T][S]) => void,
	): void;

	emit<T extends EventType, S extends EventState>(event: MFMEvent<T, S>): void;
	onAny<K extends keyof T>(handler: (type: T, event: T[K]) => void): void;
	offAny<K extends keyof T>(handler: (type: T, event: T[K]) => void): void;
}

export function EventEmitterMixin<TBase extends Constructor>(Base: TBase) {
	return class extends Base implements IEventEmitterMixin {
		#emitter: Emitter<Record<string, unknown>>;

		constructor(...args: any[]) {
			super(...args);
			this.#emitter = mitt();
		}

		on<T extends EventType, S extends EventState>(
			type: T,
			state: S,
			handler: (event: S extends ValidMFMEventState<T, S> ? MFMEventPayloadMap[T][S] : never) => void,
		) {
			this.#emitter.on(createEventType(type, state), handler);
		}

		off<T extends EventType, S extends EventState>(
			type: T,
			state: S,
			handler?: (event: S extends ValidMFMEventState<T, S> ? MFMEventPayloadMap[T][S] : never) => void,
		) {
			this.#emitter.off(createEventType(type, state), handler);
		}

		emit<T extends EventType, S extends EventState>(event: MFMEvent<T, S>) {
			this.#emitter.emit(event.type, event.payload);
		}

		onAny<K extends keyof AllMFMEvents>(handler: (type: AllMFMEvents, event: AllMFMEvents[K]) => void) {
			this.#emitter.on('*', handler as unknown as WildcardHandler);
		}

		offAny<K extends keyof AllMFMEvents>(handler: (type: AllMFMEvents, event: AllMFMEvents[K]) => void) {
			this.#emitter.off('*', handler as unknown as WildcardHandler);
		}
	};
}
